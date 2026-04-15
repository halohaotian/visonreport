'use client';
import { usePathname } from 'next/navigation';

export function LanguageSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();
  const switchLocale = locale === 'en' ? 'zh' : 'en';
  const label = locale === 'en' ? '中文' : 'EN';
  const newPath = pathname.replace(`/${locale}`, `/${switchLocale}`);

  return (
    <a href={newPath} className="px-3 py-1 text-sm text-gray-500 hover:text-blue-600 border border-gray-200 rounded-md hover:border-blue-300 transition">
      {label}
    </a>
  );
}
