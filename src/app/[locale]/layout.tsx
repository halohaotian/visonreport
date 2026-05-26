import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@dict';
import { TranslationProvider } from '@/components/TranslationProvider';
import '../globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'VisonReport — Visual Requirement Intelligence' : 'VisonReport — 需求全景可视化，一分钟看懂整个项目',
    description: isEn
      ? 'Transform requirements into visual architecture diagrams with AI. See the whole project in 1 minute.'
      : '上传需求文档，AI一键生成项目需求全景可视化图。让团队在一分钟内看到需求全貌。',
    alternates: { canonical: `https://visonreport.vercel.app/${locale}` },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <html lang={locale === 'zh' ? 'zh-CN' : 'en'} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TranslationProvider dict={dict}>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
