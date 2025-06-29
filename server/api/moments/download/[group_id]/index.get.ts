import archiver from 'archiver'

export default defineSupabaseEventHandler(async (event, user, client, server) => {

    if (!user) return useReturnResponse(event, unauthorizedError);

    const { group_id } = getRouterParams(event);

    const { data, error } = await client.from("groups")
        .select("id").eq("id", group_id).single<Tables<"groups">>()

    if( error || !data) return useReturnResponse(event, forbiddenError)

    await files(event, client, group_id)
})

const files = defineCachedFunction(async (event: H3Event, client: SupabaseClient, id: string) => {
    const { data: userFolders, error: folderErr } = await client.storage.from("images")
        .list(id, { limit: 100 });

    if (folderErr || !userFolders) return useReturnResponse(event, internalServerError)

    const allFiles = (
        await Promise.all(
            userFolders
                .filter(folder => folder.name)
                .map(async folder => {
                    const folderPath = `${id}/${folder.name}`;
                    const { data: filesInUserFolder, error: fileErr } = await client.storage.from("images")
                        .list(folderPath, { limit: 1000 });
                    if (fileErr || !filesInUserFolder) return [];
                    return filesInUserFolder.map(file => ({
                        path: `${folderPath}/${file.name}`,
                        name: `${folder.name}_${file.name}`
                    }));
                })
        )
    ).flat();

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', err => {
        return useReturnResponse(event, internalServerError);
    });

    setHeaders(event, {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${id}.zip"`,
        'Cache-Control': 'public, max-age=3600, must-revalidate',
    });

    archive.pipe(event.node.res);

    await Promise.all(allFiles.map(async file => {
        const { data: fileData } = await client.storage.from('images').download(file.path);
        if (fileData) {
            const buffer = await fileData.arrayBuffer();
            archive.append(Buffer.from(buffer), { name: file.name });
        }
    }));

    await archive.finalize();
}, {
    maxAge: 60 * 60,
    name: 'cached-files',
    getKey: (event: H3Event, client: SupabaseClient, id: string): string => {
        return `files-${id}`;
    }
});
//