import { Heart } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10 shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-linear-to-br from-primary to-medical-teal">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Heart Disease Predictor</h1>
              <p className="text-sm text-muted-foreground">API Testing Tool</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
