import Footer from "@/components/Footer";
import Navbar from "@/components/NavBar";

type MainTemplatetProps = {
    children: React.ReactNode;
}


export default function MainTemplate({children}: Readonly<MainTemplatetProps>){
    return (
        <>
            <Navbar/>
                {children}
            <Footer />
        </>
    )
}