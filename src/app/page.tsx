import Carousel from "@/components/Carousel"
import Galery from "@/components/Galery"
import Navbar from "@/components/NavBar"

export default async function HomePage() {
    return (
        <>
            <Navbar/>
            <Carousel/>
            <Galery/>
        </>
    )
}
