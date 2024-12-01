import { setRequestLocale } from 'next-intl/server';
import { ImageCarousel } from '@/components/ImageCarousel';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const images = [
    "/assets/images/alberto-castillo-q-mx4mSkK9zeo-unsplash.jpg",
    "/assets/images/inside-weather-OzqieLcs464-unsplash.jpg",
    "/assets/images/toa-heftiba-FV3GConVSss-unsplash.jpg"
  ];


  return (
    <div className="relative">
      <div className="relative h-screen -mt-5">
        <ImageCarousel images={images} />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-5xl font-light mb-6 max-w-3xl">
            Transforma tu hogar con estilo
          </h1>
          <p className="text-xl mb-8 max-w-2xl">
            Descubre nuestras colecciones
          </p>
          <button className="px-8 py-3 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors duration-300 transform hover:scale-105">
            Novedades
          </button>
        </div>
      </div>
    </div>
  );
}