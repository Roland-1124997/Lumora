
const groups = [
  {
    id: 1,
    name: "Tech Enthusiasts",
    thumbnail: "https://picsum.photos/id/1/5000/3333",
    lastActive: "2024-12-27T17:58:48.414+00:00",
    lastPhotoPostedBy: "Alex Jansen",
  },
  {
    id: 2,
    name: "Vue.js Developers",
    thumbnail: "https://picsum.photos/id/2/5000/3333",
    lastActive: "2024-12-26T14:32:21.879+00:00",
    lastPhotoPostedBy: "Sophia van Dijk",
  },
  {
    id: 3,
    name: "Laravel Lovers",
    thumbnail: "https://picsum.photos/id/3/5000/3333",
    lastActive: "2024-12-25T11:45:03.214+00:00",
    lastPhotoPostedBy: "Michael Vermeer",
  },
  {
    id: 4,
    name: "Design & Code",
    thumbnail: "https://picsum.photos/id/4/5000/3333",
    lastActive: "2024-12-27T08:13:49.612+00:00",
    lastPhotoPostedBy: "Liam de Vries",
  },
  {
    id: 5,
    name: "Digital Nomads",
    thumbnail: "https://picsum.photos/id/5/5000/3333",
    lastActive: "2024-12-24T19:57:12.431+00:00",
    lastPhotoPostedBy: "Emma Bakker",
  },
  {
    id: 6,
    name: "Full-Stack Heroes",
    thumbnail: "https://picsum.photos/id/6/5000/3333",
    lastActive: "2024-12-27T15:22:35.908+00:00",
    lastPhotoPostedBy: "Noah Smits",
  },
  {
    id: 7,
    name: "Moment(s) Creators",
    thumbnail: "https://picsum.photos/id/7/5000/3333",
    lastActive: "2024-12-25T16:48:27.143+00:00",
    lastPhotoPostedBy: "Roland Meijer",
  },
  {
    id: 8,
    name: "Frontend Wizards",
    thumbnail: "https://picsum.photos/id/8/5000/3333",
    lastActive: "2024-12-27T12:11:44.562+00:00",
    lastPhotoPostedBy: "Eva de Boer",
  },
  {
    id: 9,
    name: "Backend Builders",
    thumbnail: "https://picsum.photos/id/9/5000/3333",
    lastActive: "2024-12-26T10:05:18.907+00:00",
    lastPhotoPostedBy: "Thijs Vos",
  },
  {
    id: 10,
    name: "Agile Advocates",
    thumbnail: "https://picsum.photos/id/10/5000/3333",
    lastActive: "2024-12-26T22:33:01.478+00:00",
    lastPhotoPostedBy: "Julia Smit",
  },
  {
    id: 11,
    name: "JavaScript Ninjas",
    thumbnail: "https://picsum.photos/id/11/5000/3333",
    lastActive: "2024-12-26T09:17:52.214+00:00",
    lastPhotoPostedBy: "Daan Meijer",
  },
  {
    id: 12,
    name: "SQL Masters",
    thumbnail: "https://picsum.photos/id/12/5000/3333",
    lastActive: "2024-12-25T20:41:30.723+00:00",
    lastPhotoPostedBy: "Sara de Vries",
  },
  {
    id: 13,
    name: "Open Source Allies",
    thumbnail: "https://picsum.photos/id/13/5000/3333",
    lastActive: "2024-12-27T18:23:04.567+00:00",
    lastPhotoPostedBy: "Thomas Bakker",
  },
  {
    id: 14,
    name: "NoSQL Gurus",
    thumbnail: "https://picsum.photos/id/14/5000/3333",
    lastActive: "2024-12-25T23:12:18.352+00:00",
    lastPhotoPostedBy: "Lucas Janssen",
  },
  {
    id: 15,
    name: "Postgres Fans",
    thumbnail: "https://picsum.photos/id/15/5000/3333",
    lastActive: "2024-12-27T20:31:07.192+00:00",
    lastPhotoPostedBy: "Mila de Koning",
  },
  {
    id: 16,
    name: "Supabase Squad",
    thumbnail: "https://picsum.photos/id/16/5000/3333",
    lastActive: "2024-12-27T14:45:33.849+00:00",
    lastPhotoPostedBy: "Robin Peters",
  },
  {
    id: 17,
    name: "PHP Innovators",
    thumbnail: "https://picsum.photos/id/17/5000/3333",
    lastActive: "2024-12-26T23:59:11.037+00:00",
    lastPhotoPostedBy: "Lisa Jacobs",
  },
  {
    id: 18,
    name: "UI/UX Gurus",
    thumbnail: "https://picsum.photos/id/18/5000/3333",
    lastActive: "2024-12-25T18:22:50.931+00:00",
    lastPhotoPostedBy: "Mark Hendriks",
  },
  {
    id: 19,
    name: "Scrum Squad",
    thumbnail: "https://picsum.photos/id/19/5000/3333",
    lastActive: "2024-12-25T13:44:29.765+00:00",
    lastPhotoPostedBy: "Jasper Willems",
  },
  {
    id: 20,
    name: "Creative Coders",
    thumbnail: "https://picsum.photos/id/20/5000/3333",
    lastActive: "2024-12-27T12:30:15.314+00:00",
    lastPhotoPostedBy: "Anouk Mulder",
  },
  {
    id: 21,
    name: "Code Explorers",
    thumbnail: "https://picsum.photos/id/21/5000/3333",
    lastActive: "2024-12-27T20:13:45.712+00:00",
    lastPhotoPostedBy: "Finn Maas",
  },
  {
    id: 22,
    name: "Project Planners",
    thumbnail: "https://picsum.photos/id/22/5000/3333",
    lastActive: "2024-12-27T16:07:22.549+00:00",
    lastPhotoPostedBy: "Nina de Groot",
  },
  {
    id: 23,
    name: "DevOps Champs",
    thumbnail: "https://picsum.photos/id/23/5000/3333",
    lastActive: "2024-12-26T08:40:39.317+00:00",
    lastPhotoPostedBy: "Ruben Koster",
  },
  {
    id: 24,
    name: "Tailwind Creatives",
    thumbnail: "https://picsum.photos/id/24/5000/3333",
    lastActive: "2024-12-27T11:12:57.981+00:00",
    lastPhotoPostedBy: "Esmee Bosch",
  },
  {
    id: 25,
    name: "Git Masters",
    thumbnail: "https://picsum.photos/id/25/5000/3333",
    lastActive: "2024-12-31T21:28:00.000+00:00",
    lastPhotoPostedBy: "Koen de Lange",
  },
  {
    id: 26,
    name: "Agile Ninjas",
    thumbnail: "https://picsum.photos/id/26/5000/3333",
    lastActive: "2024-12-27T19:56:23.167+00:00",
    lastPhotoPostedBy: "Tess van Leeuwen",
  },
  {
    id: 27,
    name: "Coding Wizards",
    thumbnail: "https://picsum.photos/id/27/5000/3333",
    lastActive: "2024-12-25T22:15:18.745+00:00",
    lastPhotoPostedBy: "Tim Schouten",
  },
  {
    id: 28,
    name: "API Pioneers",
    thumbnail: "https://picsum.photos/id/28/5000/3333",
    lastActive: "2024-12-27T19:30:11.528+00:00",
    lastPhotoPostedBy: "Iris de Jong",
  },
  {
    id: 29,
    name: "Data Scientists",
    thumbnail: "https://picsum.photos/id/29/5000/3333",
    lastActive: "2024-12-24T15:33:08.364+00:00",
    lastPhotoPostedBy: "Sam Kuipers",
  },
  {
    id: 30,
    name: "Code Collaborators",
    thumbnail: "https://picsum.photos/id/30/5000/3333",
    lastActive: "2024-12-25T12:18:46.491+00:00",
    lastPhotoPostedBy: "Felicia van Dam",
  },
];

const filteredGroups = groups.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());

function splitArrayIntoChunks(array: any[], chunkSize: number): any[][] {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

export default defineEventHandler((event) => {
  return new Promise((resolve, reject) => {
    
    const query: any = getQuery(event)
    const currentPage = query.page ? parseInt(query.page) : 1;

    const chunkSize = 10;
    const arrayOfChunks = splitArrayIntoChunks(filteredGroups, chunkSize);

    return resolve({
      statusCode: 200,
      message: 'Data received',
      currentPage,
      totalPages: arrayOfChunks.length,
      groups: arrayOfChunks[currentPage - 1],
    })
  })
})
