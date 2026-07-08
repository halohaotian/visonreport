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
  const title = isEn ? 'VisonReport — Visual Requirement Intelligence' : 'VisonReport — 需求全景可视化，一分钟看懂整个项目';
  const description = isEn
    ? 'Transform requirement documents into visual architecture diagrams with AI. Upload PRDs, specs, or user stories and get a project overview map in seconds. See the whole project structure, module relationships, and missing requirements at a glance.'
    : '上传需求文档，AI 一键生成项目需求全景可视化图。让团队在一分钟内看到需求全貌——模块关系、功能清单、遗漏点一目了然。支持中英文需求文档，导出高清架构图。';
  return {
    title,
    description,
    alternates: { canonical: `https://visonreport.com/${locale}` },
    openGraph: {
      title,
      description,
      url: `https://visonreport.com/${locale}`,
      siteName: 'VisonReport',
      locale: isEn ? 'en_US' : 'zh_CN',
      type: 'website',
      images: [{ url: 'https://visonreport.com/og-image.png', width: 1200, height: 630, alt: 'VisonReport — Visual Requirement Intelligence' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://visonreport.com/og-image.png'],
    },
  };
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VisonReport',
  url: 'https://visonreport.com',
  description: 'AI-powered visual requirement intelligence platform.',
};

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <TranslationProvider dict={dict}>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}