import { Link } from "react-router";
import { useI18n } from "../../i18n";

export default function PageHome() {
  const t = useI18n();
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto p-8">
        <h1 className="text-2xl font-bold text-center mb-2">PicSharp</h1>
        <p className="text-center text-gray-600 mb-12">{t('slogan')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link 
            to="/compression" 
            className="flex flex-col items-center p-6 border-2 rounded hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold mb-4">{t('compression')}</h2>
            <p className="text-center text-sm text-gray-600">{t('compression.description')}</p>
          </Link>
          
          <Link 
            to="/conversion" 
            className="flex flex-col items-center p-6 border-2 rounded hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold mb-4">{t('conversion')}</h2>
            <p className="text-center text-sm text-gray-600">{t('conversion.description')}</p>
          </Link>
          
          <Link 
            to="/upload" 
            className="flex flex-col items-center p-6 border-2 rounded hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold mb-4">{t('oss')}</h2>
            <p className="text-center text-sm text-gray-600">{t('oss.description')}</p>
          </Link>
        </div>
      </div>

      <footer className="mt-auto border-t">
        <p className="text-center text-sm text-gray-500 py-4">{t('copyright')}</p>
      </footer>
    </div>
  );
}
