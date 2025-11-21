import CN from "../locales/cn.json";
import EN from "../locales/en.json";

export function Locale(page: string): { [key: string]: string } {
    const language = localStorage.getItem("locale") || "cn";
    switch (language) {
        case "cn":
            if (page in CN) {
                return CN[page as keyof typeof CN];
            }
        case "en":
            if (page in EN) {
                return EN[page as keyof typeof EN];
            }
        default:
            return {};
    }
}
