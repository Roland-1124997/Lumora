

export const useEmailToName = () => {
    const defaults = reactive({
        removeNumbers: true,
        removePlusWords: true,
        titleCase: true,
        caseMc: true,
        caseLetterApostrophe: true,
        uppercaseGenerationalNumbers: true,
        commaPrependGenerationalPhrase: true,
        appendPeriodToTitlePrefix: true,
        lowercaseFamilyParticle: true,
        commonPersonalIdentifiers: ['hello', 'hi', 'me', 'email', 'contact'],
        reverseCommonEmailAddresses: true,
        companyNames: [],
    });

    const titles = ['mr', 'mrs', 'ms', 'dr', 'prof'];
    const suffixes = ['jr', 'jnr', 'sr', 'snr'];
    const suffixesUpper = ['ii', 'iii', 'iv'];

    const process = (str: string, params: Partial<typeof defaults> = {}) => {
        let output = '';
        const settings = { ...defaults, ...params };

        const identifierIsCommon = matchIdentifierToList(str, settings.commonPersonalIdentifiers);
        const domainIsIdentifier = matchIdentifierToList(str, settings.companyNames);

        if (settings.reverseCommonEmailAddresses && (identifierIsCommon || domainIsIdentifier) && str.includes('@')) {
            output = reverseDomainAndIdentifier(str);
        } else {
            output = str.split('@')[0] ?? '';
        }

        if (settings.removePlusWords) {
            output = output.split('+')[0] ?? '';
        }

        if (settings.removeNumbers) {
            output = output.replace(/\d/g, '');
        }

        output = output.replace(/([a-z])([A-Z])/g, '$1 $2');

        output = output
            .replace(/\./g, ' ')
            .replace(/_/g, ' ')
            .replace(/\s\s+/g, ' ')
            .trim();

        if (settings.titleCase) {
            output = titleCase(output);
        }

        if (settings.uppercaseGenerationalNumbers) {
            suffixesUpper.forEach(suffix => {
                const rx = new RegExp(`\\s(${suffix})$`, 'gi');
                output = output.replace(rx, s => s.toUpperCase());
            });
        }

        if (settings.commaPrependGenerationalPhrase) {
            suffixes.forEach(suffix => {
                const rx = new RegExp(`\\s(${suffix})$`, 'gi');
                output = output.replace(rx, s => `,${s}.`);
            });
        }

        if (settings.appendPeriodToTitlePrefix) {
            titles.forEach(prefix => {
                const rx = new RegExp(`^(${prefix})\\s`, 'gi');
                output = output.replace(rx, s => s.replace(' ', '. '));
            });
        }

        if (settings.lowercaseFamilyParticle) {
            output = output
                .replace(/\bAl(?=\s+\w)/g, "al")
                .replace(/\bAp\b/g, "ap")
                .replace(/\bBen(?=\s+\w)\b/g, "ben")
                .replace(/\bDell([ae])\b/g, "dell$1")
                .replace(/\bD([aeiu])\b/g, "d$1")
                .replace(/\bDe([lr])\b/g, "de$1")
                .replace(/\bEl\b/g, "el")
                .replace(/\bLa\b/g, "la")
                .replace(/\bL([eo])\b/g, "l$1")
                .replace(/\bVan(?=\s+\w)/g, "van")
                .replace(/\bVon\b/g, "von");
        }

        if (settings.titleCase && settings.caseMc) {
            output = output.replace(/Mc(.)/g, (m, m1) => 'Mc' + m1.toUpperCase());
        }

        if (settings.titleCase && settings.caseLetterApostrophe) {
            output = output.replace(/\bO\'([a-z])/g, (m, m1) => "O'" + m1.toUpperCase());
        }

        return output;
    }

    const matchIdentifierToList = (str: string, identifiers: string[]) => {
        if (!identifiers || !identifiers.length) return false;
        const identifier = str.split('@')[0] ?? "";
        return identifiers.includes(identifier);
    }

    const reverseDomainAndIdentifier = (str: string): string => {
        const provider = str.split('@')[1] ?? '';
        const host = provider ? provider.split('.')[0] : '';
        return host ?? '';
    }

    const titleCase = (str: string) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    return { process };
}
