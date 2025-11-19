import BestSellers from "@/components/BestSellers";
import Carousel from "@/components/Carousel";
import Galery from "@/components/Galery";
import MainTemplate from "@/templates/MainTemplate/Index";

export default async function HomePage() {
  return (
    <>
      <MainTemplate>
        <Carousel />
        <Galery />
        <h2 className="text-center text-xl font-semibold mt-8 text-gray-800">
          Mais vendidos
        </h2>
        <BestSellers />
        <h2 className="text-center text-xl font-semibold mt-8  text-gray-800">
          Lançamentos
        </h2>
        <BestSellers />
      </MainTemplate>
    </>
  );
}
