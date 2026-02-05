import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield, AlertTriangle, Globe, Map, Leaf, Apple, Home, Lightbulb, Palette, Heart, Compass, ArrowLeft, Sun, Moon, Cloud, Droplets, Wind, Snowflake, Mountain, Trees, Fish, Bird, Bug, Flower, Sprout, Utensils, Car, Plane, Shirt, Music, Palette as PaletteIcon, Zap, Rocket, Flame, Phone, Volume2, Check, X } from 'lucide-react';

interface GenelKulturTabsProps {
  userId: string;
}

interface SubCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  items: string[];
  funFact?: string;
  headerImage?: string;
}

interface EvIciTehlikeSubCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  visuals: string[];
  game: string;
  audioNarration: string;
  reminderCard: string;
  items: string[];
  scenarios: Array<{
    question: string;
    correct: boolean;
    explanation: string;
  }>;
}

interface KuralSubCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  visualAsset: string;
  audioNarration: string;
  reminderCard: string;
  rules: Array<{
    text: string;
    example: string;
    isCorrect: boolean;
  }>;
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  content: string;
  subCategories?: SubCategory[];
  evIciTehlikeSubCategories?: EvIciTehlikeSubCategory[];
  kuralSubCategories?: KuralSubCategory[];
}

const taniyalimCategories: Category[] = [
  {
    id: 'evren-doga',
    name: 'Evren/Doğa',
    icon: <Globe className="w-6 h-6" />,
    color: 'text-blue-400',
    gradient: 'from-blue-400 to-blue-600',
    content: 'Evren, gezegenler, yıldızlar, hava durumu ve doğa olayları hakkında bilgiler...',
    subCategories: [
      {
        id: 'gunes-sistemi',
        name: 'Güneş Sistemi',
        icon: <Sun className="w-5 h-5" />,
        headerImage: '/assets/generated/gunes-sistemi-header.dim_800x400.png',
        description: 'Güneş sistemimizde 8 gezegen var. Güneş\'e en yakın gezegen Merkür, en uzak gezegen ise Neptün\'dür.',
        items: [
          '☀️ Güneş: Güneş sistemimizin merkezi, ışık ve ısı kaynağımız',
          '🌍 Dünya: Yaşadığımız gezegen, mavi gezegen olarak bilinir',
          '🔴 Mars: Kızıl gezegen, Dünya\'ya en çok benzeyen gezegen',
          '🪐 Satürn: Halkalarıyla ünlü dev gezegen',
          '🌙 Ay: Dünya\'nın uydusu, gece gökyüzünde parlayan',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Güneş o kadar büyük ki, içine 1 milyon Dünya sığabilir!',
      },
      {
        id: 'hava-durumu',
        name: 'Hava Durumu',
        icon: <Cloud className="w-5 h-5" />,
        headerImage: '/assets/generated/hava-durumu-header.dim_800x400.png',
        description: 'Hava durumu her gün değişir. Güneşli, yağmurlu, karlı veya rüzgarlı olabilir.',
        items: [
          '☀️ Güneşli: Gökyüzü açık, hava sıcak ve parlak',
          '🌧️ Yağmurlu: Bulutlardan yağmur damlaları düşer',
          '❄️ Karlı: Hava çok soğuk olunca kar yağar',
          '🌬️ Rüzgarlı: Hava hareket eder, ağaçlar sallanır',
          '🌈 Gökkuşağı: Yağmur sonrası güneşle oluşan renkli ışık',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Gökkuşağında 7 renk vardır: Kırmızı, turuncu, sarı, yeşil, mavi, lacivert, mor!',
      },
      {
        id: 'dogal-olaylar',
        name: 'Doğal Olaylar',
        icon: <Mountain className="w-5 h-5" />,
        headerImage: '/assets/generated/dogal-olaylar-header.dim_800x400.png',
        description: 'Doğada birçok ilginç olay gerçekleşir. Bunlar doğanın gücünü gösterir.',
        items: [
          '🌋 Volkan: Dağın içinden sıcak lav çıkar',
          '🌊 Tsunami: Denizde oluşan dev dalgalar',
          '🌪️ Kasırga: Çok güçlü dönen rüzgar fırtınası',
          '⚡ Şimşek: Bulutlarda oluşan elektrik boşalması',
          '🌙 Ay Tutulması: Dünya, Ay\'ın önüne geçer',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Bir şimşek çakması 30.000 derece sıcaklığa ulaşabilir!',
      },
      {
        id: 'gece-gunduz',
        name: 'Gece ve Gündüz',
        icon: <Moon className="w-5 h-5" />,
        headerImage: '/assets/generated/gece-gunduz-header.dim_800x400.png',
        description: 'Dünya döndüğü için gece ve gündüz oluşur. Güneş doğunca gündüz, batınca gece olur.',
        items: [
          '🌅 Gün Doğumu: Güneş doğuda görünür, sabah başlar',
          '☀️ Gündüz: Güneş gökyüzünde, her yer aydınlık',
          '🌆 Gün Batımı: Güneş batıda kaybolur, akşam olur',
          '🌙 Gece: Ay ve yıldızlar görünür, karanlık olur',
          '🌍 Dünya Dönüşü: Dünya 24 saatte bir tur atar',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Dünya kendi etrafında dönerken saatte 1.670 km hızla hareket eder!',
      },
    ],
  },
  {
    id: 'cografya',
    name: 'Coğrafya',
    icon: <Map className="w-6 h-6" />,
    color: 'text-green-400',
    gradient: 'from-green-400 to-green-600',
    content: 'Ülkeler, kıtalar, haritalar ve önemli yerler hakkında bilgiler...',
    subCategories: [
      {
        id: 'kitalar-ulkeler',
        name: 'Kıtalar ve Ülkeler',
        icon: <Globe className="w-5 h-5" />,
        headerImage: '/assets/generated/kitalar-ulkeler-header.dim_800x400.png',
        description: 'Dünyada 7 kıta ve 195\'ten fazla ülke vardır. Her kıtanın kendine özgü özellikleri vardır.',
        items: [
          '🌏 Asya: En büyük kıta, Türkiye\'nin de bulunduğu kıta',
          '🌍 Afrika: Sıcak iklimi ve vahşi hayvanlarıyla ünlü',
          '🌎 Amerika: Kuzey ve Güney Amerika olmak üzere ikiye ayrılır',
          '🇪🇺 Avrupa: Tarihi şehirleri ve kültürüyle tanınır',
          '🇹🇷 Türkiye: Bizim ülkemiz, iki kıtada yer alır',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Türkiye, hem Avrupa hem de Asya kıtasında yer alan tek ülkedir!',
      },
      {
        id: 'unlu-yerler',
        name: 'Ünlü Yerler',
        icon: <Compass className="w-5 h-5" />,
        headerImage: '/assets/generated/unlu-yerler-header.dim_800x400.png',
        description: 'Dünyada görülmeye değer birçok ünlü yer vardır.',
        items: [
          '🗼 Eyfel Kulesi: Paris\'in sembolü, 324 metre yüksekliğinde',
          '🗽 Özgürlük Anıtı: New York\'ta, özgürlüğün simgesi',
          '🏛️ Ayasofya: İstanbul\'da tarihi yapı',
          '🏰 Çin Seddi: Uzaydan görülebilen tek yapı',
          '🗿 Moai Heykelleri: Paskalya Adası\'ndaki dev taş heykeller',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Çin Seddi 21.000 km uzunluğundadır!',
      },
      {
        id: 'haritalar',
        name: 'Haritalar',
        icon: <Map className="w-5 h-5" />,
        headerImage: '/assets/generated/haritalar-header.dim_800x400.png',
        description: 'Haritalar, yerleri bulmamıza ve yön bulmamıza yardımcı olur.',
        items: [
          '🗺️ Dünya Haritası: Tüm kıtaları ve okyanusları gösterir',
          '🧭 Pusula: Kuzey yönünü gösterir',
          '📍 Konum İşaretleri: Önemli yerleri gösterir',
          '🛣️ Yol Haritası: Şehirler arası yolları gösterir',
          '🏔️ Fiziki Harita: Dağları, nehirleri gösterir',
        ],
        funFact: '🌟 Eğlenceli Bilgi: İlk haritalar 2.500 yıl önce yapıldı!',
      },
      {
        id: 'iklim-bolgeleri',
        name: 'İklim Bölgeleri',
        icon: <Cloud className="w-5 h-5" />,
        headerImage: '/assets/generated/iklim-bolgeleri-header.dim_800x400.png',
        description: 'Dünyada farklı iklim bölgeleri vardır. Sıcak, soğuk, ılıman ve kutup bölgeleri.',
        items: [
          '🌴 Tropikal İklim: Çok sıcak ve yağışlı, ormanlar var',
          '🏜️ Çöl İklimi: Çok sıcak ve kurak, az yağış',
          '🌳 Ilıman İklim: Ne çok sıcak ne çok soğuk',
          '❄️ Kutup İklimi: Çok soğuk, buzullar var',
          '🏔️ Dağ İklimi: Yükseklerde soğuk, alçakta ılık',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Antarktika\'da -89 derece soğuk ölçüldü!',
      },
    ],
  },
  {
    id: 'canlilar',
    name: 'Canlılar',
    icon: <img src="/assets/generated/canlilar-icon-transparent.dim_64x64.png" alt="Canlılar" className="w-6 h-6" />,
    color: 'text-orange-400',
    gradient: 'from-orange-400 to-orange-600',
    content: 'Hayvanlar, yaşam alanları, özellikleri ve davranışları hakkında bilgiler...',
    subCategories: [
      {
        id: 'hayvan-turleri',
        name: 'Hayvan Türleri',
        icon: <Bird className="w-5 h-5" />,
        headerImage: '/assets/generated/hayvan-turleri-header.dim_800x400.png',
        description: 'Hayvanlar farklı gruplara ayrılır: Memeliler, kuşlar, sürüngenler, balıklar ve böcekler.',
        items: [
          '🐱 Memeliler: Sütle besler, kedi, köpek, fil',
          '🦅 Kuşlar: Uçar, tüylü, gagalı, kartal, papağan',
          '🐍 Sürüngenler: Pullu derili, yılan, kertenkele',
          '🐟 Balıklar: Suda yaşar, solungaçla nefes alır',
          '🐝 Böcekler: 6 bacaklı, arı, kelebek, karınca',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Dünyada 1 milyondan fazla böcek türü vardır!',
      },
      {
        id: 'yasam-alanlari',
        name: 'Yaşam Alanları',
        icon: <Trees className="w-5 h-5" />,
        headerImage: '/assets/generated/animal-habitats-collection.dim_600x400.png',
        description: 'Hayvanlar farklı yerlerde yaşar. Orman, deniz, çöl, kutuplar gibi.',
        items: [
          '🌳 Orman: Ağaçlar arasında, kuşlar, sincaplar',
          '🌊 Deniz: Suda, balıklar, yunuslar, balinalar',
          '🏜️ Çöl: Kurak yerlerde, develer, kertenkeleler',
          '❄️ Kutuplar: Buzlu yerlerde, penguenler, kutup ayıları',
          '🏔️ Dağlar: Yükseklerde, kartallar, keçiler',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Kutup ayıları yüzerek 100 km yol gidebilir!',
      },
      {
        id: 'hayvan-davranislari',
        name: 'Hayvan Davranışları',
        icon: <Heart className="w-5 h-5" />,
        headerImage: '/assets/generated/hayvan-davranislari-header.dim_800x400.png',
        description: 'Hayvanlar farklı davranışlar gösterir. Göç eder, yuva yapar, avlanır.',
        items: [
          '🦅 Avlanma: Yiyecek bulmak için avlanırlar',
          '🏠 Yuva Yapma: Barınmak için yuva yaparlar',
          '🦆 Göç Etme: Mevsime göre yer değiştirirler',
          '😴 Kış Uykusu: Kışın uyuyarak enerji tasarrufu yaparlar',
          '👨‍👩‍👧 Sürü Halinde: Güvenlik için grup halinde yaşarlar',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Bazı kuşlar 10.000 km göç eder!',
      },
      {
        id: 'nesli-tukenen',
        name: 'Nesli Tükenen Hayvanlar',
        icon: <AlertTriangle className="w-5 h-5" />,
        headerImage: '/assets/generated/nesli-tukenen-hayvanlar-header.dim_800x400.png',
        description: 'Bazı hayvanlar yok olma tehlikesiyle karşı karşıya. Onları korumamız gerekir.',
        items: [
          '🐼 Panda: Çok az kaldı, bambu ormanlarında yaşar',
          '🦏 Gergedan: Avlanma yüzünden azaldı',
          '🐅 Kaplan: Ormanlar yok olunca azaldı',
          '🐢 Deniz Kaplumbağası: Deniz kirliliği tehdit ediyor',
          '🦅 Kel Kartal: Korunma sayesinde sayısı arttı',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Dinozorlar 65 milyon yıl önce yok oldu!',
      },
    ],
  },
  {
    id: 'bitkiler',
    name: 'Bitkiler',
    icon: <Leaf className="w-6 h-6" />,
    color: 'text-emerald-400',
    gradient: 'from-emerald-400 to-emerald-600',
    content: 'Bitki türleri, büyüme döngüleri ve botanik bilgiler...',
    subCategories: [
      {
        id: 'bitki-turleri',
        name: 'Bitki Türleri',
        icon: <Trees className="w-5 h-5" />,
        headerImage: '/assets/generated/bitki-turleri-header.dim_800x400.png',
        description: 'Bitkiler farklı türlerde olabilir. Ağaçlar, çiçekler, otlar ve daha fazlası.',
        items: [
          '🌳 Ağaçlar: Uzun ve kalın gövdeli, yıllarca yaşar',
          '🌸 Çiçekler: Renkli ve güzel kokulu, böcekleri çeker',
          '🌿 Otlar: Kısa boylu, hızlı büyüyen bitkiler',
          '🌵 Kaktüsler: Çölde yaşar, az suya ihtiyaç duyar',
          '🌾 Tahıllar: Buğday, arpa gibi, ekmek yapımında kullanılır',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Bambu, günde 90 cm büyüyebilen en hızlı büyüyen bitkidir!',
      },
      {
        id: 'buyume-dongusu',
        name: 'Büyüme Döngüsü',
        icon: <Sprout className="w-5 h-5" />,
        headerImage: '/assets/generated/plant-growth-cycle.dim_500x400.png',
        description: 'Bitkiler tohumdan başlayarak büyür ve gelişir.',
        items: [
          '🌰 Tohum: Bitkinin başlangıcı, toprakta bekler',
          '🌱 Filizlenme: Tohum çimlenir, kök ve gövde çıkar',
          '🌿 Büyüme: Yapraklar açılır, bitki uzar',
          '🌸 Çiçeklenme: Çiçekler açar, renkli olur',
          '🍎 Meyve Verme: Meyveler olgunlaşır',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Bir fasulye tohumu sadece birkaç günde filizlenebilir!',
      },
      {
        id: 'fotosentez',
        name: 'Fotosentez',
        icon: <Sun className="w-5 h-5" />,
        headerImage: '/assets/generated/fotosentez-header.dim_800x400.png',
        description: 'Bitkiler güneş ışığını kullanarak kendi yiyeceklerini üretir.',
        items: [
          '☀️ Güneş Işığı: Enerji kaynağı',
          '💧 Su: Köklerden alınır',
          '🌬️ Karbondioksit: Havadan alınır',
          '🍃 Yapraklar: Fotosentez yapılan yer',
          '🌬️ Oksijen: Üretilen temiz hava',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Bitkiler sayesinde nefes alabiliriz!',
      },
      {
        id: 'mevsimsel-degisimler',
        name: 'Mevsimsel Değişimler',
        icon: <Flower className="w-5 h-5" />,
        headerImage: '/assets/generated/mevsimsel-degisimler-header.dim_800x400.png',
        description: 'Bitkiler mevsimlere göre değişir. İlkbaharda çiçek açar, sonbaharda yaprak döker.',
        items: [
          '🌸 İlkbahar: Çiçekler açar, yapraklar çıkar',
          '☀️ Yaz: Bitkiler büyür, meyveler olgunlaşır',
          '🍂 Sonbahar: Yapraklar dökülür, renkler değişir',
          '❄️ Kış: Bitkiler dinlenir, bazıları uyur',
          '🌱 Yeniden Başlangıç: İlkbaharda tekrar canlanır',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Yapraklar sonbaharda kırmızı, sarı, turuncu olur!',
      },
    ],
  },
  {
    id: 'gunluk-yasam',
    name: 'Günlük Yaşam',
    icon: <Home className="w-6 h-6" />,
    color: 'text-yellow-400',
    gradient: 'from-yellow-400 to-yellow-600',
    content: 'Günlük yaşam konuları, ev eşyaları, rutinler ve pratik bilgiler...',
    subCategories: [
      {
        id: 'ev-esyalari',
        name: 'Ev Eşyaları',
        icon: <Home className="w-5 h-5" />,
        headerImage: '/assets/generated/ev-esyalari-header.dim_800x400.png',
        description: 'Evimizde kullandığımız önemli eşyalar.',
        items: [
          '🛋️ Mobilyalar: Koltuk, masa, sandalye, yatak',
          '📺 Elektronik Aletler: Televizyon, bilgisayar, telefon',
          '🍳 Mutfak Eşyaları: Tencere, tabak, çatal, kaşık',
          '🧹 Temizlik Malzemeleri: Süpürge, bez, deterjan',
          '💡 Aydınlatma: Lamba, avize, abajur',
        ],
        funFact: '🌟 Eğlenceli Bilgi: İlk buzdolabı 1913 yılında icat edildi!',
      },
      {
        id: 'gunluk-rutinler',
        name: 'Günlük Rutinler',
        icon: <Sun className="w-5 h-5" />,
        headerImage: '/assets/generated/daily-routine-activities.dim_600x400.png',
        description: 'Her gün yaptığımız düzenli aktiviteler.',
        items: [
          '🌅 Sabah Uyanmak: Güne başlamak, kahvaltı yapmak',
          '🪥 Diş Fırçalamak: Sabah ve akşam dişlerimizi temizleriz',
          '🍳 Kahvaltı: Günün en önemli öğünü',
          '🎒 Okula Gitmek: Öğrenmek ve arkadaşlarla vakit geçirmek',
          '🌙 Uyumak: Dinlenmek ve büyümek için gerekli',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Çocuklar büyümek için günde 9-11 saat uyumalıdır!',
      },
      {
        id: 'toplum-yardimcilari',
        name: 'Toplum Yardımcıları',
        icon: <Heart className="w-5 h-5" />,
        headerImage: '/assets/generated/daily-routine-activities.dim_600x400.png',
        description: 'Toplumda bize yardım eden önemli insanlar.',
        items: [
          '👨‍⚕️ Doktor: Hastaları iyileştirir, sağlığımızı korur',
          '👨‍🏫 Öğretmen: Bize yeni şeyler öğretir',
          '👮 Polis: Güvenliğimizi sağlar, suçluları yakalar',
          '🚒 İtfaiyeci: Yangınları söndürür, hayat kurtarır',
          '📮 Postacı: Mektup ve paketleri dağıtır',
        ],
        funFact: '🌟 Eğlenceli Bilgi: İtfaiyeciler yangın yerine 4 dakikada ulaşmaya çalışır!',
      },
      {
        id: 'ulasim-araclari',
        name: 'Ulaşım Araçları',
        icon: <Car className="w-5 h-5" />,
        headerImage: '/assets/generated/daily-routine-activities.dim_600x400.png',
        description: 'Bir yerden başka bir yere gitmek için kullandığımız araçlar.',
        items: [
          '🚗 Araba: Karayolunda giden, 4 tekerlekli araç',
          '🚌 Otobüs: Çok kişi taşıyan büyük araç',
          '🚂 Tren: Raylar üzerinde giden, hızlı ulaşım',
          '✈️ Uçak: Havada uçan, uzak yerlere gider',
          '🚲 Bisiklet: Pedal çevirerek gidilen, çevre dostu',
        ],
        funFact: '🌟 Eğlenceli Bilgi: En hızlı tren saatte 600 km hıza ulaşabilir!',
      },
    ],
  },
  {
    id: 'bilim-teknoloji',
    name: 'Bilim-Teknoloji',
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'text-purple-400',
    gradient: 'from-purple-400 to-purple-600',
    content: 'Bilim ve teknoloji kavramları, icatlar ve keşifler...',
    subCategories: [
      {
        id: 'onemli-icatlar',
        name: 'Önemli İcatlar',
        icon: <Lightbulb className="w-5 h-5" />,
        headerImage: '/assets/generated/science-technology-timeline.dim_800x400.png',
        description: 'Hayatımızı değiştiren önemli icatlar.',
        items: [
          '💡 Ampul: Thomas Edison, elektrikli ışık',
          '📞 Telefon: Alexander Graham Bell, uzaktan konuşma',
          '✈️ Uçak: Wright Kardeşler, havada uçma',
          '💻 Bilgisayar: Modern teknolojinin temeli',
          '🚗 Otomobil: Karl Benz, motorlu taşıt',
        ],
        funFact: '🌟 Eğlenceli Bilgi: İlk bilgisayar bir oda kadar büyüktü!',
      },
      {
        id: 'basit-makineler',
        name: 'Basit Makineler',
        icon: <Zap className="w-5 h-5" />,
        headerImage: '/assets/generated/science-technology-timeline.dim_800x400.png',
        description: 'İşimizi kolaylaştıran basit araçlar.',
        items: [
          '⚙️ Kaldıraç: Ağır şeyleri kaldırmaya yardım eder',
          '🔩 Vida: Şeyleri birbirine bağlar',
          '🎡 Tekerlek: Hareket etmeyi kolaylaştırır',
          '⛰️ Eğik Düzlem: Yukarı çıkmayı kolaylaştırır',
          '🪝 Makara: Ağırlık çekmeyi kolaylaştırır',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Tekerlek, 5000 yıl önce icat edildi!',
      },
      {
        id: 'teknoloji-gelisimi',
        name: 'Teknoloji Gelişimi',
        icon: <Rocket className="w-5 h-5" />,
        headerImage: '/assets/generated/science-technology-timeline.dim_800x400.png',
        description: 'Teknoloji zamanla nasıl gelişti.',
        items: [
          '📜 Geçmiş: Taş aletler, ateş, tekerlek',
          '🏭 Sanayi Devrimi: Makineler, fabrikalar',
          '💻 Bilgisayar Çağı: İnternet, akıllı telefonlar',
          '🤖 Yapay Zeka: Akıllı robotlar, otomatik sistemler',
          '🚀 Uzay Çağı: Roketler, uydular, uzay istasyonları',
        ],
        funFact: '🌟 Eğlenceli Bilgi: İlk cep telefonu 1 kg ağırlığındaydı!',
      },
      {
        id: 'bilimsel-kesifler',
        name: 'Bilimsel Keşifler',
        icon: <Zap className="w-5 h-5" />,
        headerImage: '/assets/generated/science-technology-timeline.dim_800x400.png',
        description: 'Bilim insanlarının yaptığı önemli keşifler.',
        items: [
          '🔬 Mikroskop: Çok küçük şeyleri görmemizi sağlar',
          '🧬 DNA: Canlıların genetik şifresi',
          '⚡ Elektrik: Benjamin Franklin keşfetti',
          '🌍 Yerçekimi: Isaac Newton buldu',
          '💊 Aşılar: Hastalıklardan korur',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Marie Curie, radyoaktiviteyi keşfetti ve 2 Nobel Ödülü kazandı!',
      },
    ],
  },
  {
    id: 'kultur-sanat',
    name: 'Kültür-Sanat',
    icon: <Palette className="w-6 h-6" />,
    color: 'text-pink-400',
    gradient: 'from-pink-400 to-pink-600',
    content: 'Gelenekler, müzik, resim ve kültürel miras...',
    subCategories: [
      {
        id: 'dunya-kulturu',
        name: 'Dünya Kültürleri',
        icon: <Globe className="w-5 h-5" />,
        headerImage: '/assets/generated/cultural-arts-collage.dim_600x500.png',
        description: 'Farklı ülkelerin kültürel özellikleri.',
        items: [
          '🗾 Japonya: Origami, sumo, kimono',
          '🇫🇷 Fransa: Bale, opera, moda',
          '🇮🇹 İtalya: Opera, pizza, pasta',
          '🇨🇳 Çin: Ejderha dansı, kung fu',
          '🇹🇷 Türkiye: Ebru, Karagöz, Türk kahvesi',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Origami, Japonca\'da "kağıt katlama" anlamına gelir!',
      },
      {
        id: 'sanat-turleri',
        name: 'Sanat Türleri',
        icon: <PaletteIcon className="w-5 h-5" />,
        headerImage: '/assets/generated/cultural-arts-collage.dim_600x500.png',
        description: 'Farklı sanat dalları ve ifade biçimleri.',
        items: [
          '🎨 Resim: Boya ile yapılan görsel sanat',
          '🗿 Heykel: Taş, metal veya kilden yapılan sanat',
          '🎭 Tiyatro: Sahnede oyunculuk sanatı',
          '💃 Dans: Müzikle hareket sanatı',
          '📸 Fotoğraf: Anları yakalama sanatı',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Leonardo da Vinci, Mona Lisa\'yı 4 yılda tamamladı!',
      },
      {
        id: 'muzik-aletleri',
        name: 'Müzik Aletleri',
        icon: <Music className="w-5 h-5" />,
        headerImage: '/assets/generated/cultural-arts-collage.dim_600x500.png',
        description: 'Farklı müzik aletleri ve sesleri.',
        items: [
          '🎹 Piyano: Tuşlu çalgı, güzel melodiler',
          '🎸 Gitar: Telli çalgı, popüler enstrüman',
          '🥁 Davul: Vurmalı çalgı, ritim tutar',
          '🎺 Trompet: Üflemeli çalgı, parlak ses',
          '🎻 Keman: Yaylı çalgı, zarif ses',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Piyano\'da 88 tuş vardır!',
      },
      {
        id: 'festivaller',
        name: 'Festivaller',
        icon: <Heart className="w-5 h-5" />,
        headerImage: '/assets/generated/cultural-arts-collage.dim_600x500.png',
        description: 'Dünya çapında kutlanan özel günler ve festivaller.',
        items: [
          '🎉 Yılbaşı: Yeni yılı kutlama',
          '🎊 Ramazan Bayramı: Müslümanların dini bayramı',
          '🎃 Cadılar Bayramı: Kostümlü eğlence',
          '🎄 Noel: Hristiyanların dini bayramı',
          '🎆 Ulusal Bayramlar: Her ülkenin özel günleri',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Brezilya Karnavalı dünyanın en büyük festivalidir!',
      },
    ],
  },
  {
    id: 'beslenme-saglik',
    name: 'Beslenme-Sağlık',
    icon: <Heart className="w-6 h-6" />,
    color: 'text-red-400',
    gradient: 'from-red-400 to-red-600',
    content: 'Sağlıklı beslenme, hijyen ve sağlık konuları...',
    subCategories: [
      {
        id: 'besin-gruplari',
        name: 'Besin Grupları',
        icon: <Apple className="w-5 h-5" />,
        headerImage: '/assets/generated/healthy-food-pyramid.dim_500x600.png',
        description: 'Sağlıklı olmak için farklı besin gruplarından yememiz gerekir.',
        items: [
          '🥛 Süt Grubu: Süt, peynir, yoğurt - kemikler için',
          '🍖 Et Grubu: Et, tavuk, balık, yumurta - kaslar için',
          '🥖 Tahıl Grubu: Ekmek, makarna, pirinç - enerji için',
          '🥕 Sebze Grubu: Havuç, domates, salatalık - vitaminler için',
          '🍎 Meyve Grubu: Elma, muz, portakal - sağlık için',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Vücudumuzun %60\'ı sudan oluşur!',
      },
      {
        id: 'vucut-sistemleri',
        name: 'Vücut Sistemleri',
        icon: <Heart className="w-5 h-5" />,
        headerImage: '/assets/generated/healthy-food-pyramid.dim_500x600.png',
        description: 'Vücudumuzun farklı sistemleri ve görevleri.',
        items: [
          '❤️ Kalp: Kanı pompalar, vücuda dağıtır',
          '🫁 Akciğerler: Nefes alırız, oksijen alırız',
          '🧠 Beyin: Düşünür, kontrol eder',
          '🦴 İskelet: Vücudu destekler, korur',
          '💪 Kaslar: Hareket etmemizi sağlar',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Kalp günde 100.000 kez atar!',
      },
      {
        id: 'hijyen-kurallari',
        name: 'Hijyen Kuralları',
        icon: <Droplets className="w-5 h-5" />,
        headerImage: '/assets/generated/healthy-food-pyramid.dim_500x600.png',
        description: 'Temiz ve sağlıklı kalmak için yapılması gerekenler.',
        items: [
          '🪥 Diş Fırçalama: Günde 2 kez, sabah akşam',
          '🧼 El Yıkama: Yemekten önce ve sonra, tuvaletten sonra',
          '🚿 Banyo Yapma: Düzenli olarak temizlenmeliyiz',
          '💇 Saç Bakımı: Saçlarımızı düzenli yıkamalıyız',
          '👔 Temiz Giysi: Her gün temiz kıyafet giymeliyiz',
        ],
        funFact: '🌟 Eğlenceli Bilgi: El yıkama 20 saniye sürmelidir!',
      },
      {
        id: 'egzersiz-spor',
        name: 'Egzersiz ve Spor',
        icon: <Heart className="w-5 h-5" />,
        headerImage: '/assets/generated/healthy-food-pyramid.dim_500x600.png',
        description: 'Sağlıklı kalmak için hareket etmeliyiz.',
        items: [
          '⚽ Futbol: Takım sporu, koşma ve tekme',
          '🏀 Basketbol: Top atma ve sıçrama',
          '🏊 Yüzme: Suda hareket, tüm vücudu çalıştırır',
          '🚴 Bisiklet: Pedal çevirme, bacakları güçlendirir',
          '🧘 Yoga: Esneme ve rahatlama',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Çocuklar günde en az 60 dakika aktif olmalıdır!',
      },
    ],
  },
  {
    id: 'yon-kavramlar',
    name: 'Yön ve Kavramlar',
    icon: <Compass className="w-6 h-6" />,
    color: 'text-cyan-400',
    gradient: 'from-cyan-400 to-cyan-600',
    content: 'Yönler, mekansal farkındalık, zaman ve temel kavramlar...',
    subCategories: [
      {
        id: 'mekansal-yonler',
        name: 'Mekansal Yönler',
        icon: <Compass className="w-5 h-5" />,
        headerImage: '/assets/generated/directional-concepts-illustration.dim_600x400.png',
        description: 'Farklı yönler ve konumlar.',
        items: [
          '⬆️ Yukarı: Gökyüzüne doğru',
          '⬇️ Aşağı: Yere doğru',
          '➡️ Sağ: Sağ el tarafı',
          '⬅️ Sol: Sol el tarafı',
          '🧭 Kuzey: Pusulanın gösterdiği yön',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Pusula her zaman kuzeyi gösterir!',
      },
      {
        id: 'zaman-kavramlari',
        name: 'Zaman Kavramları',
        icon: <Sun className="w-5 h-5" />,
        headerImage: '/assets/generated/directional-concepts-illustration.dim_600x400.png',
        description: 'Zamanla ilgili temel kavramlar.',
        items: [
          '🌅 Sabah: Güneş doğduğunda',
          '☀️ Öğle: Güneş tepedeyken',
          '🌆 Akşam: Güneş batarken',
          '🌙 Gece: Karanlık olduğunda',
          '📅 Dün-Bugün-Yarın: Zaman sıralaması',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Bir gün 24 saat, bir saat 60 dakikadır!',
      },
      {
        id: 'boyut-karsilastirmalari',
        name: 'Boyut Karşılaştırmaları',
        icon: <Compass className="w-5 h-5" />,
        headerImage: '/assets/generated/directional-concepts-illustration.dim_600x400.png',
        description: 'Büyüklük ve boyutla ilgili kavramlar.',
        items: [
          '📏 Uzun - Kısa: Boyut karşılaştırması',
          '⚖️ Ağır - Hafif: Ağırlık karşılaştırması',
          '📐 Büyük - Küçük: Boyut farkı',
          '🌡️ Sıcak - Soğuk: Sıcaklık farkı',
          '🏃 Hızlı - Yavaş: Sürat farkı',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Fil, karada yaşayan en büyük hayvandır!',
      },
      {
        id: 'sayi-miktar',
        name: 'Sayı ve Miktar',
        icon: <Compass className="w-5 h-5" />,
        headerImage: '/assets/generated/directional-concepts-illustration.dim_600x400.png',
        description: 'Sayı ve miktarla ilgili kavramlar.',
        items: [
          '🔢 Çok - Az: Miktar karşılaştırması',
          '➕ Daha Fazla: Artış',
          '➖ Daha Az: Azalma',
          '🟰 Eşit: Aynı miktar',
          '🥇 İlk - Son: Sıralama',
        ],
        funFact: '🌟 Eğlenceli Bilgi: Sıfır, çok önemli bir sayıdır ve Hindistan\'da icat edilmiştir!',
      },
    ],
  },
];

const kurallarCategories: Category[] = [
  {
    id: 'okul-kurallari',
    name: 'Okul Kuralları',
    icon: <img src="/assets/generated/okul-kurallari-icon-transparent.dim_64x64.png" alt="Okul" className="w-6 h-6" />,
    color: 'text-blue-400',
    gradient: 'from-blue-400 to-blue-600',
    content: 'Sınıf davranışları, öğretmenlere saygı ve okul görgü kuralları...',
    kuralSubCategories: [
      {
        id: 'okul-kurallari-content',
        name: '✅ Okul Kuralları',
        icon: '🏫',
        description: 'Okulda uyulması gereken temel kurallar.',
        visualAsset: '/assets/generated/okul-kurallari-icon-transparent.dim_64x64.png',
        audioNarration: 'Okul ortamında nasıl davranılır',
        reminderCard: 'Okul kuralları — Başarının anahtarı!',
        rules: [
          {
            text: 'Okula zamanında gel ve hazırlıklı ol',
            example: 'Saatinde okula gitmek → ✅',
            isCorrect: true,
          },
          {
            text: 'Öğretmenini ve arkadaşlarını dinle',
            example: 'Ders sırasında sessiz olmak → ✅',
            isCorrect: true,
          },
          {
            text: 'Sınıfta sessizce otur ve katıl',
            example: 'Bağırmak ve konuşmak → ❌',
            isCorrect: false,
          },
          {
            text: 'Okul malzemelerine özen göster',
            example: 'Kalemleri fırlatmak → ❌',
            isCorrect: false,
          },
          {
            text: 'Koridorlarda yavaş yürü',
            example: 'Koşarak gitmek → ❌',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'sinif-kurallari',
    name: 'Sınıf Davranış Kuralları',
    icon: <img src="/assets/generated/sinif-kurallari-icon-transparent.dim_64x64.png" alt="Sınıf" className="w-6 h-6" />,
    color: 'text-green-400',
    gradient: 'from-green-400 to-green-600',
    content: 'Katılım, dinleme ve işbirliği kuralları...',
    kuralSubCategories: [
      {
        id: 'sinif-kurallari-content',
        name: '✅ Sınıf Davranış Kuralları',
        icon: '📚',
        description: 'Sınıfta dikkat edilmesi gereken davranış kuralları.',
        visualAsset: '/assets/generated/sinif-kurallari-icon-transparent.dim_64x64.png',
        audioNarration: 'Sınıf arkadaşları ile uyum',
        reminderCard: 'Saygı ve işbirliği — Sınıfın temeli!',
        rules: [
          {
            text: 'Konuşmadan önce parmak kaldır',
            example: 'Ders sırasında söz almak → ✅',
            isCorrect: true,
          },
          {
            text: 'Arkadaşlarının fikirlerini dinle',
            example: 'Başkalarına söz hakkı vermek → ✅',
            isCorrect: true,
          },
          {
            text: 'Sıranı temiz ve düzenli tut',
            example: 'Sıra üzerinde oyun oynamak → ❌',
            isCorrect: false,
          },
          {
            text: 'Grup çalışmalarında işbirliği yap',
            example: 'Ortak çalışmalara katılmamak → ❌',
            isCorrect: false,
          },
          {
            text: 'Sınıf içinde saygılı davran',
            example: 'Arkadaşlarına bağırmak → ❌',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'ders-sorumluluk',
    name: 'Ders & Sorumluluk',
    icon: <img src="/assets/generated/ders-sorumluluk-icon-transparent.dim_64x64.png" alt="Ders" className="w-6 h-6" />,
    color: 'text-purple-400',
    gradient: 'from-purple-400 to-purple-600',
    content: 'Ödev, hazırlık ve akademik görevler...',
    kuralSubCategories: [
      {
        id: 'ders-sorumluluk-content',
        name: '✅ Ders & Sorumluluk',
        icon: '📖',
        description: 'Derste başarılı olmak için takip edilecek kurallar.',
        visualAsset: '/assets/generated/ders-sorumluluk-icon-transparent.dim_64x64.png',
        audioNarration: 'Derslere hazırlanmak ve sorumluluk',
        reminderCard: 'Düzenli çalışma — Başarının yolu!',
        rules: [
          {
            text: 'Ödevlerini zamanında yap',
            example: 'Ders bitiminde sorumluluk almak → ✅',
            isCorrect: true,
          },
          {
            text: 'Ders çalışma saatlerini planla',
            example: 'Planlı çalışmak → ✅',
            isCorrect: true,
          },
          {
            text: 'Kitaplarını ve defterlerini hazırla',
            example: 'Eşyaları kaybetmek → ❌',
            isCorrect: false,
          },
          {
            text: 'Sorularını çekinmeden sor',
            example: 'Cevabı öğrenme fırsatını kaçırmamak → ✅',
            isCorrect: true,
          },
          {
            text: 'Öğrendiklerini tekrar et',
            example: 'Tekrar yapmamak → ❌',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'temizlik',
    name: 'Temizlik & Düzen',
    icon: <img src="/assets/generated/temizlik-duzeni-icon-transparent.dim_64x64.png" alt="Temizlik" className="w-6 h-6" />,
    color: 'text-teal-400',
    gradient: 'from-teal-400 to-teal-600',
    content: 'Kişisel hijyen, çevre temizliği ve düzen...',
    kuralSubCategories: [
      {
        id: 'temizlik-content',
        name: '✅ Temizlik & Düzen',
        icon: '🧹',
        description: 'Kişisel ve çevresel temizlik kuralları.',
        visualAsset: '/assets/generated/temizlik-duzeni-icon-transparent.dim_64x64.png',
        audioNarration: 'Temiz ve düzenli ortam kuralları',
        reminderCard: 'Temizlik — Sağlığın başlangıcı!',
        rules: [
          {
            text: 'Ellerini düzenli olarak yıka',
            example: 'Tuvaletten sonra elleri yıkamak → ✅',
            isCorrect: true,
          },
          {
            text: 'Çevreni temiz ve düzenli tut',
            example: 'Çöp kutusuna atmak → ✅',
            isCorrect: true,
          },
          {
            text: 'Kişisel eşyalarını düzenli tut',
            example: 'Eşyaları dağınık bırakmak → ❌',
            isCorrect: false,
          },
          {
            text: 'Temizlik malzemelerini doğru kullan',
            example: 'Kirli eşyaları başkaları için temiz bırakmak → ✅',
            isCorrect: true,
          },
          {
            text: 'Kıyafetlerini özenli kullan',
            example: 'Kıyafetleri yere atmak → ❌',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'guvenlik',
    name: 'Güvenlik',
    icon: <img src="/assets/generated/guvenlik-kurallari-icon-transparent.dim_64x64.png" alt="Güvenlik" className="w-6 h-6" />,
    color: 'text-orange-400',
    gradient: 'from-orange-400 to-orange-600',
    content: 'Okul, ev ve kamusal alan güvenliği...',
    kuralSubCategories: [
      {
        id: 'guvenlik-content',
        name: '✅ Güvenlik',
        icon: '🛡️',
        description: 'Kendini ve başkalarını koruma kuralları.',
        visualAsset: '/assets/generated/guvenlik-kurallari-icon-transparent.dim_64x64.png',
        audioNarration: 'Güvenli yaşam kuralları',
        reminderCard: 'Güvenlik — Her zaman önce!',
        rules: [
          {
            text: 'Merdivenlerde korkuluğu tut',
            example: 'Düşme tehlikesinden korunmak → ✅',
            isCorrect: true,
          },
          {
            text: 'Keskin nesnelerden uzak dur',
            example: 'Kendini yaralamamak için dikkat etmek → ✅',
            isCorrect: true,
          },
          {
            text: 'Trafik kurallarına uy',
            example: 'Yaya geçidinden geçmek → ✅',
            isCorrect: true,
          },
          {
            text: 'Yabancılarla konuşma',
            example: 'Kendini korumak için dikkatli olmak → ✅',
            isCorrect: true,
          },
          {
            text: 'Acil durumda yardım iste',
            example: 'Güvenle yardım almak → ✅',
            isCorrect: true,
          },
        ],
      },
    ],
  },
  {
    id: 'dijital',
    name: 'Dijital Kurallar',
    icon: <img src="/assets/generated/dijital-kurallar-icon-transparent.dim_64x64.png" alt="Dijital" className="w-6 h-6" />,
    color: 'text-cyan-400',
    gradient: 'from-cyan-400 to-cyan-600',
    content: 'İnternet kullanımı, ekran süresi ve çevrimiçi davranış...',
    kuralSubCategories: [
      {
        id: 'dijital-content',
        name: '✅ Dijital Kurallar',
        icon: '💻',
        description: 'Dijital dünyada güvenli ve sorumlu davranma kuralları.',
        visualAsset: '/assets/generated/dijital-kurallar-icon-transparent.dim_64x64.png',
        audioNarration: 'Dijital dünyada güvenli davranışlar',
        reminderCard: 'Dijital dünya — Güvenli keşfet!',
        rules: [
          {
            text: 'Ekran süresini sınırla',
            example: 'Zararlı olmadan cihaz kullanmak → ✅',
            isCorrect: true,
          },
          {
            text: 'İnternette güvenli ol',
            example: 'Güçlü şifre kullanmak → ✅',
            isCorrect: true,
          },
          {
            text: 'Kişisel bilgilerini paylaşma',
            example: 'Başkalarına güvenli bilgi vermemek → ✅',
            isCorrect: true,
          },
          {
            text: 'Dijital cihazları doğru kullan',
            example: 'Başkalarının cihazına zarar vermemek → ✅',
            isCorrect: true,
          },
          {
            text: 'Online davranışlarında saygılı ol',
            example: 'Sosyal medya ve mesajlarda nazik olmak → ✅',
            isCorrect: true,
          },
        ],
      },
    ],
  },
  {
    id: 'ahlak',
    name: 'Ahlak & Değerler',
    icon: <img src="/assets/generated/ahlak-degerler-icon-transparent.dim_64x64.png" alt="Ahlak" className="w-6 h-6" />,
    color: 'text-pink-400',
    gradient: 'from-pink-400 to-pink-600',
    content: 'Dürüstlük, nezaket ve saygı...',
    kuralSubCategories: [
      {
        id: 'ahlak-content',
        name: '✅ Ahlak & Değerler',
        icon: '💖',
        description: 'Doğru ve erdemli birey olmanın temel kuralları.',
        visualAsset: '/assets/generated/ahlak-degerler-icon-transparent.dim_64x64.png',
        audioNarration: 'Ahlak ve değerler eğitimi',
        reminderCard: 'Dürüst ol — Empati kur!',
        rules: [
          {
            text: 'Dürüst ol ve doğruyu söyle',
            example: 'Yalan söylemek → ❌',
            isCorrect: false,
          },
          {
            text: 'Başkalarına empati göster',
            example: 'Farklı fikir ve duygulara saygı → ✅',
            isCorrect: true,
          },
          {
            text: 'Yardımsever ve paylaşımcı ol',
            example: 'Başkalarına yardımcı olmak → ✅',
            isCorrect: true,
          },
          {
            text: 'Farklılıklara saygı duy',
            example: 'Başkalarını anlamak → ✅',
            isCorrect: true,
          },
          {
            text: 'Sorumluluklarını yerine getir',
            example: 'Yarım iş bırakmak → ❌',
            isCorrect: false,
          },
        ],
      },
    ],
  },
  {
    id: 'cevre',
    name: 'Çevre & Toplum',
    icon: <img src="/assets/generated/cevre-toplum-icon-transparent.dim_64x64.png" alt="Çevre" className="w-6 h-6" />,
    color: 'text-emerald-400',
    gradient: 'from-emerald-400 to-emerald-600',
    content: 'Doğa koruma, geri dönüşüm ve sürdürülebilirlik...',
    kuralSubCategories: [
      {
        id: 'cevre-content',
        name: '✅ Çevre & Toplum',
        icon: '🌍',
        description: 'Doğayı koruma ve toplum içinde sorumluluk alma kuralları.',
        visualAsset: '/assets/generated/cevre-toplum-icon-transparent.dim_64x64.png',
        audioNarration: 'Çevre ve toplumsal kurallar',
        reminderCard: 'Çevre — Geleceğimizin anahtarı!',
        rules: [
          {
            text: 'Doğayı koru ve sev',
            example: 'Hayvanlara ve bitkilere iyi bakmak → ✅',
            isCorrect: true,
          },
          {
            text: 'Geri dönüşüme katıl',
            example: 'Çöpleri ayıklamak → ✅',
            isCorrect: true,
          },
          {
            text: 'Su ve enerjiyi tasarruf et',
            example: 'Musluğu açık bırakmak → ❌',
            isCorrect: false,
          },
          {
            text: 'Toplum kurallarına uy',
            example: 'Başkasının hakkına saygı → ✅',
            isCorrect: true,
          },
          {
            text: 'Çevresel sorumluluğunu al',
            example: 'Doğal kaynakları korumak → ✅',
            isCorrect: true,
          },
        ],
      },
    ],
  },
  {
    id: 'kisisel-gelisim',
    name: 'Kişisel Gelişim',
    icon: <img src="/assets/generated/kisisel-gelisim-icon-transparent.dim_64x64.png" alt="Gelişim" className="w-6 h-6" />,
    color: 'text-indigo-400',
    gradient: 'from-indigo-400 to-indigo-600',
    content: 'Kendini geliştirme, hedef belirleme ve karakter oluşturma...',
    kuralSubCategories: [
      {
        id: 'kisisel-gelisim-content',
        name: '✅ Kişisel Gelişim',
        icon: '🌟',
        description: 'Kendini geliştirmek için tavsiye ve temel kurallar.',
        visualAsset: '/assets/generated/kisisel-gelisim-icon-transparent.dim_64x64.png',
        audioNarration: 'Kişisel gelişim rehberi',
        reminderCard: 'Büyü ve gelişmeye devam et!',
        rules: [
          {
            text: 'Hedeflerini belirle ve takip et',
            example: 'Başarılı olmanın yolları → ✅',
            isCorrect: true,
          },
          {
            text: 'Hatalarından öğren',
            example: 'Ders çıkararak gelişmek → ✅',
            isCorrect: true,
          },
          {
            text: 'Kendine güven ve sabırlı ol',
            example: 'Pozitif düşünce geliştir → ✅',
            isCorrect: true,
          },
          {
            text: 'Yeni şeyler öğrenmeye açık ol',
            example: 'Hatalardan ders çıkarmak → ✅',
            isCorrect: true,
          },
          {
            text: 'Pozitif düşünce geliştir',
            example: 'Olumlu yaklaşım geliştirmek → ✅',
            isCorrect: true,
          },
        ],
      },
    ],
  },
];

const acilDurumlarCategories: Category[] = [
  {
    id: 'ev-ici-tehlikeler',
    name: 'Ev İçi Tehlikeler',
    icon: <Home className="w-6 h-6" />,
    color: 'text-red-400',
    gradient: 'from-red-400 to-red-600',
    content: 'Elektrik tehlikeleri, kesici aletler ve ev içi güvenlik...',
    evIciTehlikeSubCategories: [
      {
        id: 'elektrik-guvenligi',
        name: '🔌 Elektrik Güvenliği',
        icon: '⚡',
        description: 'Prizler tehlikelidir. Islak elle asla dokunmamalıyız!',
        visuals: [
          '/assets/generated/elektrik-priz-kapak.dim_400x300.png',
          '/assets/generated/elektrik-dogru-yanlis-animasyon.dim_600x400.png',
          '/assets/generated/elektrik-uyari-simgeleri.dim_300x200.png',
        ],
        game: '🎮 Güvenli mi Tehlikeli mi? (Priz-Oyuncak-Fiş Seçim Oyunu)',
        audioNarration: '🔊 Prizlerin tehlikesi ve doğru davranışlar hakkında sesli anlatım',
        reminderCard: '⚠️ Islak elle dokunma!',
        items: [
          '🔌 Priz Kapakları: Prizleri kapalı tutmalıyız',
          '💧 Islak El Tehlikesi: Islak elle elektrikli aletlere dokunmayalım',
          '⚡ Elektrik Çarpması: Çok tehlikeli, büyüklere haber verelim',
          '🔌 Fiş Çekme: Kablodan değil, fişten tutarak çekelim',
          '👨‍👩‍👧 Yetişkin Yardımı: Elektrikli aletleri büyüklerle kullanmalıyız',
        ],
        scenarios: [
          {
            question: 'Islak ellerle prize dokunmak',
            correct: false,
            explanation: 'Yanlış! Islak ellerle prize asla dokunmamalıyız. Elektrik çarpabilir!',
          },
          {
            question: 'Priz kapağı kullanmak',
            correct: true,
            explanation: 'Doğru! Priz kapakları güvenliğimizi sağlar.',
          },
          {
            question: 'Fişi kablodan çekerek çıkarmak',
            correct: false,
            explanation: 'Yanlış! Fişi her zaman fişten tutarak çekmeliyiz.',
          },
        ],
      },
      {
        id: 'sicak-yuzeyler',
        name: '🔥 Sıcak Yüzeyler',
        icon: '🔥',
        description: 'Ocak, kettle ve kaynar su çok sıcaktır. Yaklaşmamalıyız!',
        visuals: [
          '/assets/generated/sicak-yuzeyler-koleksiyonu.dim_500x400.png',
          '/assets/generated/sicak-uyari-animasyonu.dim_400x300.png',
        ],
        game: '🎮 Sıcağa Dokunur musun? (Refleks Oyunu)',
        audioNarration: '🔊 Sıcakken dokunulmaz! Sesli uyarı',
        reminderCard: '⚠️ Sıcakken dokunulmaz!',
        items: [
          '🍳 Ocak Tehlikesi: Ocağa yaklaşmamalıyız',
          '☕ Sıcak İçecekler: Çay, kahve çok sıcak olabilir',
          '💧 Kaynar Su: Buhar bile yakabilir',
          '🔥 Ütü: Çok sıcak, dokunmamalıyız',
          '🧤 Güvenli Mesafe: Sıcak şeylerden uzak durmalıyız',
        ],
        scenarios: [
          {
            question: 'Ocağın yanında oynamak',
            correct: false,
            explanation: 'Yanlış! Ocak çok sıcaktır, yaklaşmamalıyız.',
          },
          {
            question: 'Sıcak tencereye dokunmadan önce büyüklere sormak',
            correct: true,
            explanation: 'Doğru! Her zaman büyüklere sormalıyız.',
          },
          {
            question: 'Kaynar suya el atmak',
            correct: false,
            explanation: 'Yanlış! Kaynar su çok tehlikelidir, yakabilir!',
          },
        ],
      },
      {
        id: 'kimyasallar-ilaclar',
        name: '🧴 Kimyasallar & İlaçlar',
        icon: '🧴',
        description: 'Temizlik ürünleri ve ilaçlar oyuncak değildir. Asla yutmamalıyız!',
        visuals: [
          '/assets/generated/kimyasal-ilac-koleksiyonu.dim_500x400.png',
        ],
        game: '🎮 Dolap Yerleştirme Oyunu',
        audioNarration: '🔊 İlaçlar ve kimyasallar tehlikelidir',
        reminderCard: '⚠️ İlaç ≠ Oyuncak!',
        items: [
          '🧴 Temizlik Ürünleri: Deterjan, çamaşır suyu tehlikelidir',
          '💊 İlaçlar: Sadece doktor söylerse kullanılır',
          '🚫 Yutma Tehlikesi: Asla ağzımıza götürmemeliyiz',
          '🔒 Kapalı Dolap: Yüksek ve kapalı yerde saklanmalı',
          '👨‍⚕️ Zehirlenme: Hemen büyüklere haber vermeliyiz',
        ],
        scenarios: [
          {
            question: 'İlaçları oyuncak gibi kullanmak',
            correct: false,
            explanation: 'Yanlış! İlaçlar oyuncak değildir, çok tehlikelidir!',
          },
          {
            question: 'Temizlik ürünlerini kapalı dolapda saklamak',
            correct: true,
            explanation: 'Doğru! Kimyasallar güvenli yerde saklanmalıdır.',
          },
          {
            question: 'Deterjan kapsüllerini yemek',
            correct: false,
            explanation: 'Yanlış! Asla yutmamalıyız, çok tehlikelidir!',
          },
        ],
      },
      {
        id: 'kesici-delici-aletler',
        name: '✂️ Kesici – Delici Aletler',
        icon: '✂️',
        description: 'Makas, bıçak ve kırık cam çok tehlikelidir. Dikkatli olmalıyız!',
        visuals: [
          '/assets/generated/kesici-delici-aletler.dim_500x300.png',
          '/assets/generated/cam-kirilma-uyari.dim_400x400.png',
        ],
        game: '🎮 Hangisi Tehlikeli? (Mini Soru Oyunu)',
        audioNarration: '🔊 Kesici aletlere dikkat et',
        reminderCard: '⚠️ Kesici aletlerden uzak dur!',
        items: [
          '✂️ Makas: Sadece büyüklerle kullanmalıyız',
          '🔪 Bıçak: Çok keskin, dokunmamalıyız',
          '🪟 Kırık Cam: Çok tehlikeli, yaklaşmamalıyız',
          '📌 İğne ve Çivi: Batabilir, dikkatli olmalıyız',
          '🩹 Yaralanma: Hemen büyüklere haber vermeliyiz',
        ],
        scenarios: [
          {
            question: 'Makası büyüklerin gözetiminde kullanmak',
            correct: true,
            explanation: 'Doğru! Makası her zaman büyüklerle kullanmalıyız.',
          },
          {
            question: 'Kırık cama dokunmak',
            correct: false,
            explanation: 'Yanlış! Kırık cam çok tehlikelidir, keser!',
          },
          {
            question: 'Bıçakla oynamak',
            correct: false,
            explanation: 'Yanlış! Bıçak oyuncak değildir, çok keskindir!',
          },
        ],
      },
      {
        id: 'balkon-merdiven',
        name: '🏠 Balkon – Merdiven',
        icon: '🏠',
        description: 'Balkon ve merdivenlerde çok dikkatli olmalıyız. Düşebiliriz!',
        visuals: [
          '/assets/generated/balkon-merdiven-tehlike.dim_600x400.png',
          '/assets/generated/ev-guvenlik-oyun-arayuzu.dim_500x300.png',
        ],
        game: '🎮 Doğru Davranışı Seç (Mini Senaryo)',
        audioNarration: '🔊 Güvenli davran, düşme!',
        reminderCard: '⚠️ Güvenli davran, düşme!',
        items: [
          '🪟 Pencere Tehlikesi: Pencereye tırmanmamalıyız',
          '🏠 Balkon Korkuluğu: Korkuluğa çıkmamalıyız',
          '🪜 Merdiven Güvenliği: Koşmamalı, tutunarak inmeliyiz',
          '🪑 Sandalye Tehlikesi: Sandalyeye çıkıp pencereye uzanmamalıyız',
          '👨‍👩‍👧 Yetişkin Gözetimi: Balkonda büyüklerle olmalıyız',
        ],
        scenarios: [
          {
            question: 'Merdivende koşmak',
            correct: false,
            explanation: 'Yanlış! Merdivende koşarsak düşebiliriz!',
          },
          {
            question: 'Merdivenden tutunarak inmek',
            correct: true,
            explanation: 'Doğru! Her zaman tutunarak inmeliyiz.',
          },
          {
            question: 'Balkon korkuluğuna tırmanmak',
            correct: false,
            explanation: 'Yanlış! Çok tehlikeli, düşebiliriz!',
          },
        ],
      },
    ],
  },
  {
    id: 'yangin-guvenligi',
    name: 'Yangın Güvenliği',
    icon: <Flame className="w-6 h-6" />,
    color: 'text-orange-400',
    gradient: 'from-orange-400 to-orange-600',
    content: 'Yangın önleme, kaçış yolları ve acil prosedürler...',
  },
  {
    id: 'dogal-afetler',
    name: 'Doğal Afetler',
    icon: <Globe className="w-6 h-6" />,
    color: 'text-blue-400',
    gradient: 'from-blue-400 to-blue-600',
    content: 'Depremler, seller ve uygun tepkiler...',
  },
  {
    id: 'acil-yardim',
    name: 'Acil Durum Yardımı',
    icon: <Phone className="w-6 h-6" />,
    color: 'text-pink-400',
    gradient: 'from-pink-400 to-pink-600',
    content: 'Ne zaman ve nasıl yardım çağrılır...',
  },
  {
    id: 'dis-guvenlik',
    name: 'Dış Güvenlik',
    icon: <Shield className="w-6 h-6" />,
    color: 'text-green-400',
    gradient: 'from-green-400 to-green-600',
    content: 'Trafik kuralları, oyun alanı güvenliği ve kamusal alanlar...',
  },
  {
    id: 'yabancilar',
    name: 'Yabancılarla İletişim',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'text-yellow-400',
    gradient: 'from-yellow-400 to-yellow-600',
    content: 'Yabancı güvenliği, uygun etkileşimler ve kişisel sınırlar...',
  },
  {
    id: 'hayvan-guvenligi',
    name: 'Hayvan Güvenliği',
    icon: <Leaf className="w-6 h-6" />,
    color: 'text-teal-400',
    gradient: 'from-teal-400 to-teal-600',
    content: 'Evcil hayvan bakımı ve vahşi hayvan karşılaşmaları...',
  },
  {
    id: 'zehirlenme',
    name: 'Zehirlenme',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'text-purple-400',
    gradient: 'from-purple-400 to-purple-600',
    content: 'Ev kimyasalları ve bitki güvenliği...',
  },
];

export default function GenelKulturTabs({ userId }: GenelKulturTabsProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>('taniyalim');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState<number>(0);
  const [showScenarioResult, setShowScenarioResult] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [currentRuleIndex, setCurrentRuleIndex] = useState<number>(0);

  const playAudioNarration = (text: string) => {
    // Simulated text-to-speech using Web Speech API
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const renderCategoryGrid = (categories: Category[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group animate-fade-in"
          onClick={() => {
            setSelectedCategory(category.id);
            setSelectedSubCategory(null);
            setCurrentScenarioIndex(0);
            setShowScenarioResult(false);
            setSelectedAnswer(null);
            setCurrentRuleIndex(0);
          }}
        >
          <CardContent className="p-4 sm:p-5 flex flex-col items-center justify-center text-center h-full min-h-[120px]">
            <div className="relative mb-3">
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 rounded-full blur-xl group-hover:opacity-40 transition-opacity`} />
              <div className={`relative z-10 ${category.color} transition-transform group-hover:scale-110`}>
                {category.icon}
              </div>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              {category.name}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderKuralContent = (category: Category) => {
    if (!category.kuralSubCategories) return null;
    
    const subCat = category.kuralSubCategories[0];
    if (!subCat) return null;

    const currentRule = subCat.rules[currentRuleIndex];

    return (
      <div className="space-y-4 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentRuleIndex(0);
            }}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri
          </Button>
          <div className="text-3xl">{subCat.icon}</div>
          <h3 className="text-2xl font-bold text-white">{subCat.name}</h3>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {/* Header Visual */}
                <div className="w-full rounded-lg overflow-hidden border-2 border-white/20 shadow-xl animate-fade-in flex items-center justify-center bg-gradient-to-br from-white/5 to-white/10 p-8">
                  <img 
                    src={subCat.visualAsset} 
                    alt={subCat.name}
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                {/* Description */}
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border-2 border-blue-400/30 animate-fade-in">
                  <p className="text-white/90 text-base leading-relaxed font-semibold">
                    {subCat.description}
                  </p>
                </div>

                {/* Rules List */}
                <div className="space-y-3">
                  {subCat.rules.map((rule, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-102 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {rule.isCorrect ? '✅' : '❌'}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-base leading-relaxed font-semibold mb-2">
                            {rule.text}
                          </p>
                          <p className="text-white/70 text-sm leading-relaxed">
                            {rule.example}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Interactive "Doğru mu Yanlış mı?" Section */}
                <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border-2 border-purple-400/30 animate-fade-in">
                  <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    🎮 Doğru mu Yanlış mı?
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/10 rounded-lg">
                      <p className="text-white text-base mb-2 font-semibold">{currentRule.text}</p>
                      <p className="text-white/70 text-sm mb-4">{currentRule.example}</p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            playAudioNarration(currentRule.isCorrect ? 'Doğru! Harika!' : 'Yanlış! Tekrar dene!');
                            if (currentRuleIndex < subCat.rules.length - 1) {
                              setTimeout(() => setCurrentRuleIndex(currentRuleIndex + 1), 1500);
                            }
                          }}
                          className={`flex-1 ${
                            currentRule.isCorrect
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Doğru
                        </Button>
                        <Button
                          onClick={() => {
                            playAudioNarration(!currentRule.isCorrect ? 'Doğru! Harika!' : 'Yanlış! Tekrar dene!');
                            if (currentRuleIndex < subCat.rules.length - 1) {
                              setTimeout(() => setCurrentRuleIndex(currentRuleIndex + 1), 1500);
                            }
                          }}
                          className={`flex-1 ${
                            !currentRule.isCorrect
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          <X className="w-5 h-5 mr-2" />
                          Yanlış
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audio Narration */}
                <div className="p-5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border-2 border-indigo-400/30 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold text-base leading-relaxed flex-1">
                      {subCat.audioNarration}
                    </p>
                    <Button
                      onClick={() => playAudioNarration(subCat.description + '. ' + subCat.rules.map(r => r.text).join('. '))}
                      className="ml-4 bg-white/20 hover:bg-white/30"
                      size="icon"
                    >
                      <Volume2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Reminder Card */}
                <div className="mt-6 p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border-2 border-yellow-400/30 animate-pulse">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">⚡</span>
                    <p className="text-white font-bold text-lg leading-relaxed text-center">
                      {subCat.reminderCard}
                    </p>
                    <span className="text-3xl">🚨</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEvIciTehlikeSubCategories = (category: Category) => {
    if (!category.evIciTehlikeSubCategories) return null;

    return (
      <div className="space-y-4 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => setSelectedCategory(null)}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri
          </Button>
          <div className={`${category.color}`}>
            {category.icon}
          </div>
          <h3 className="text-2xl font-bold text-white">{category.name}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {category.evIciTehlikeSubCategories.map((subCat, index) => (
            <Card
              key={subCat.id}
              className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => {
                setSelectedSubCategory(subCat.id);
                setCurrentScenarioIndex(0);
                setShowScenarioResult(false);
                setSelectedAnswer(null);
              }}
            >
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-3xl">{subCat.icon}</div>
                  <h4 className="text-base font-bold text-white">{subCat.name}</h4>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {subCat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderEvIciTehlikeContent = (category: Category) => {
    if (!category.evIciTehlikeSubCategories) return null;
    
    const subCat = category.evIciTehlikeSubCategories.find(sc => sc.id === selectedSubCategory);
    if (!subCat) return null;

    const currentScenario = subCat.scenarios[currentScenarioIndex];

    return (
      <div className="space-y-4 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => {
              setSelectedSubCategory(null);
              setCurrentScenarioIndex(0);
              setShowScenarioResult(false);
              setSelectedAnswer(null);
            }}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri
          </Button>
          <div className="text-3xl">{subCat.icon}</div>
          <h3 className="text-2xl font-bold text-white">{subCat.name}</h3>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-6">
                {/* Header Visuals */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subCat.visuals.map((visual, index) => (
                    <div 
                      key={index} 
                      className="w-full rounded-lg overflow-hidden border-2 border-white/20 shadow-xl animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <img 
                        src={visual} 
                        alt={`${subCat.name} görsel ${index + 1}`}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div className="p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg border-2 border-red-400/30 animate-fade-in">
                  <p className="text-white/90 text-base leading-relaxed font-semibold">
                    {subCat.description}
                  </p>
                </div>

                {/* Information Items */}
                <div className="space-y-3">
                  {subCat.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-102 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <p className="text-white text-base leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Interactive "Doğru mu Yanlış mı?" Toggle */}
                <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border-2 border-blue-400/30 animate-fade-in">
                  <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    🎮 Doğru mu Yanlış mı?
                  </h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/10 rounded-lg">
                      <p className="text-white text-base mb-4">{currentScenario.question}</p>
                      <div className="flex gap-3">
                        <Button
                          onClick={() => {
                            setSelectedAnswer(true);
                            setShowScenarioResult(true);
                          }}
                          disabled={showScenarioResult}
                          className={`flex-1 ${
                            showScenarioResult && currentScenario.correct
                              ? 'bg-green-500 hover:bg-green-600'
                              : showScenarioResult && selectedAnswer === true
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Doğru
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedAnswer(false);
                            setShowScenarioResult(true);
                          }}
                          disabled={showScenarioResult}
                          className={`flex-1 ${
                            showScenarioResult && !currentScenario.correct
                              ? 'bg-green-500 hover:bg-green-600'
                              : showScenarioResult && selectedAnswer === false
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          <X className="w-5 h-5 mr-2" />
                          Yanlış
                        </Button>
                      </div>
                    </div>
                    
                    {showScenarioResult && (
                      <div className={`p-4 rounded-lg animate-fade-in ${
                        selectedAnswer === currentScenario.correct
                          ? 'bg-green-500/20 border-2 border-green-400/30'
                          : 'bg-red-500/20 border-2 border-red-400/30'
                      }`}>
                        <p className="text-white font-semibold mb-2">
                          {selectedAnswer === currentScenario.correct ? '✅ Harika!' : '❌ Tekrar dene!'}
                        </p>
                        <p className="text-white/90 text-sm">{currentScenario.explanation}</p>
                        {currentScenarioIndex < subCat.scenarios.length - 1 && (
                          <Button
                            onClick={() => {
                              setCurrentScenarioIndex(currentScenarioIndex + 1);
                              setShowScenarioResult(false);
                              setSelectedAnswer(null);
                            }}
                            className="mt-3 bg-white/20 hover:bg-white/30"
                          >
                            Sonraki Soru →
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Interactive Game */}
                <div className="p-5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border-2 border-purple-400/30 animate-fade-in">
                  <p className="text-white font-semibold text-base leading-relaxed">
                    {subCat.game}
                  </p>
                </div>

                {/* Audio Narration */}
                <div className="p-5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border-2 border-indigo-400/30 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold text-base leading-relaxed flex-1">
                      {subCat.audioNarration}
                    </p>
                    <Button
                      onClick={() => playAudioNarration(subCat.description + '. ' + subCat.items.join('. '))}
                      className="ml-4 bg-white/20 hover:bg-white/30"
                      size="icon"
                    >
                      <Volume2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Reminder Card */}
                <div className="mt-6 p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border-2 border-yellow-400/30 animate-pulse">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-3xl">⚡</span>
                    <p className="text-white font-bold text-lg leading-relaxed text-center">
                      {subCat.reminderCard}
                    </p>
                    <span className="text-3xl">🚨</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSubCategoryGrid = (category: Category) => {
    if (!category.subCategories) return null;

    return (
      <div className="space-y-4 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => setSelectedCategory(null)}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri
          </Button>
          <div className={`${category.color}`}>
            {category.icon}
          </div>
          <h3 className="text-2xl font-bold text-white">{category.name}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {category.subCategories.map((subCat, index) => (
            <Card
              key={subCat.id}
              className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedSubCategory(subCat.id)}
            >
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`${category.color}`}>
                    {subCat.icon}
                  </div>
                  <h4 className="text-base font-bold text-white">{subCat.name}</h4>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">
                  {subCat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderSubCategoryContent = (category: Category) => {
    if (!category.subCategories) return null;
    
    const subCat = category.subCategories.find(sc => sc.id === selectedSubCategory);
    if (!subCat) return null;

    return (
      <div className="space-y-4 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => setSelectedSubCategory(null)}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri
          </Button>
          <div className={`${category.color}`}>
            {subCat.icon}
          </div>
          <h3 className="text-2xl font-bold text-white">{subCat.name}</h3>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {subCat.headerImage && (
                  <div className="w-full rounded-lg overflow-hidden border-2 border-white/20 shadow-xl animate-fade-in">
                    <img 
                      src={subCat.headerImage} 
                      alt={subCat.name}
                      className="w-full h-auto object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="p-4 bg-gradient-to-br from-white/10 to-white/5 rounded-lg border border-white/20 animate-fade-in">
                  <p className="text-white/90 text-base leading-relaxed">
                    {subCat.description}
                  </p>
                </div>

                <div className="space-y-3">
                  {subCat.items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-102 animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <p className="text-white text-base leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                {subCat.funFact && (
                  <div className="mt-6 p-5 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border-2 border-yellow-400/30 animate-pulse">
                    <p className="text-white font-semibold text-base leading-relaxed">
                      {subCat.funFact}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCategoryContent = (categories: Category[]) => {
    const category = categories.find(c => c.id === selectedCategory);
    if (!category) return null;

    if (selectedSubCategory) {
      if (category.evIciTehlikeSubCategories) {
        return renderEvIciTehlikeContent(category);
      }
      return renderSubCategoryContent(category);
    }

    if (category.kuralSubCategories) {
      return renderKuralContent(category);
    }

    if (category.evIciTehlikeSubCategories) {
      return renderEvIciTehlikeSubCategories(category);
    }

    if (category.subCategories) {
      return renderSubCategoryGrid(category);
    }

    return (
      <div className="space-y-4 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={() => setSelectedCategory(null)}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Geri
          </Button>
          <div className={`${category.color}`}>
            {category.icon}
          </div>
          <h3 className="text-2xl font-bold text-white">{category.name}</h3>
        </div>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <p className="text-white/90 text-base leading-relaxed">
                  {category.content}
                </p>
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-white/70 text-sm text-center italic">
                    Bu bölüm yakında daha fazla eğitici içerik ve interaktif aktivitelerle güncellenecek!
                  </p>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeSubTab} onValueChange={(value) => { 
        setActiveSubTab(value); 
        setSelectedCategory(null); 
        setSelectedSubCategory(null);
        setCurrentScenarioIndex(0);
        setShowScenarioResult(false);
        setSelectedAnswer(null);
        setCurrentRuleIndex(0);
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/10">
          <TabsTrigger 
            value="taniyalim" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white text-white/70 text-xs sm:text-sm"
          >
            <BookOpen className="w-4 h-4 mr-1 sm:mr-2" />
            Tanıyalım
          </TabsTrigger>
          <TabsTrigger 
            value="kurallar" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white text-white/70 text-xs sm:text-sm"
          >
            <Shield className="w-4 h-4 mr-1 sm:mr-2" />
            Kurallar
          </TabsTrigger>
          <TabsTrigger 
            value="acil-durumlar" 
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white text-white/70 text-xs sm:text-sm"
          >
            <AlertTriangle className="w-4 h-4 mr-1 sm:mr-2" />
            Acil Durumlar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="taniyalim" className="mt-0">
          {selectedCategory ? renderCategoryContent(taniyalimCategories) : renderCategoryGrid(taniyalimCategories)}
        </TabsContent>

        <TabsContent value="kurallar" className="mt-0">
          {selectedCategory ? renderCategoryContent(kurallarCategories) : renderCategoryGrid(kurallarCategories)}
        </TabsContent>

        <TabsContent value="acil-durumlar" className="mt-0">
          {selectedCategory ? renderCategoryContent(acilDurumlarCategories) : renderCategoryGrid(acilDurumlarCategories)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
