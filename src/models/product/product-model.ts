type ligue = "NBA" | "NHL" | "NFL" | "MLS";
type size = "PP" | "P" | "M" | "G" | "GG";
type serie = "Atual temporada" | "Retrô";
type sport = "Futebol" | "Basquete" | "Hóckei" | "Futebol Americano";

export type ProductModel = {
    id: string,
    name: string,
    price: string,
    coverImageUrl: string, 
    size: size | size[],
    year: string,
    code: string,
    time: string,
    serie: serie,
    ligue: ligue,
    color?: string,
    sport: sport,
    description: string
}