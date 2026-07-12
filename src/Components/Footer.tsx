import Indicator from "./Indicator";



interface Props {
    footerBgEnabled?: boolean;
    isDark?: boolean;
    onShowTerms: () => void;
    onShowPrivacy: () => void;
}

export default function Footer({footerBgEnabled, isDark, onShowTerms, onShowPrivacy}: Props) {
  return (
    <>
    <footer className="w-full flex flex-col mt-auto border-t border-outline-variant/10 border-b-2 border-b-gray-200"> 
        <div
          className={`w-full relative ${footerBgEnabled ? '' : 'bg-surface-container-low'}`}
          style={footerBgEnabled ? {
            backgroundImage: `url('${isDark ? '/w-footer-dark.png' : '/w-footer-lite.png'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        >
          {footerBgEnabled && (
            <div className="absolute inset-0 z-0" style={{
              background: isDark ? 'linear-gradient(to bottom, rgba(25,28,30,0.8), rgba(25,28,30,0.95))' : 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0.95))'
            }} />
          )}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end px-10 py-12 w-full max-w-7xl mx-auto gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="text-2xl font-headline font-bold text-on-surface"><span className='bigbesty'>Sudoku Sanctuary</span></div>
              <p className="font-body text-label-md text-on-surface-variant tracking-wide text-center md:text-left text-sm ">
                © {new Date().getFullYear()} Mindgames Sanctuary.All Rights Reserved.
              </p>
            </div>
            <div className="flex gap-8 items-center text-sm">
              <button onClick={onShowPrivacy} className="text-primary font-medium tracking-wide cursor-pointer">Privacy Policy</button>
              <button onClick={onShowTerms} className="text-on-surface-variant hover:text-primary transition-all font-medium tracking-wide cursor-pointer">Terms of Service</button>
            </div>
          </div>
          <div className="relative z-10 w-full text-center pb-1 text-label-md font-medium text-on-surface-variant opacity-90">
            Made with ❤️ in India | Enjoy 😊
          </div>
        </div>
        <div className="w-full h-3" style={{
          backgroundImage:'url(footerPattern.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}></div>
      </footer>
      </>
  )
}
