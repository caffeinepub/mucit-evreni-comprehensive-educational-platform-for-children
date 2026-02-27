export default function Footer() {
  const handlePrivacyClick = () => {
    // Open external Google Sites privacy policy page
    window.open('https://sites.google.com/view/mucitevreni/mucit-evreni-gizlilik-politikasi', '_blank');
  };

  return (
    <footer className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md border-t border-white/10 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <p className="text-white/80 text-sm">
            © 2025 Mucit Evreni
          </p>
          
          <span className="hidden sm:inline text-white/40">•</span>
          <button
            onClick={handlePrivacyClick}
            className="text-white/80 hover:text-white text-sm underline transition-colors"
          >
            Gizlilik Politikası
          </button>
        </div>
      </div>
    </footer>
  );
}
