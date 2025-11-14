import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";

type Screen = "home" | "catalog" | "cart" | "profile" | "favorites" | "orders" | "search" | "notifications";

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  inStock: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);

  const products: Product[] = [
    { id: 1, name: "Беспроводные наушники Premium", price: 4990, originalPrice: 6990, discount: 30, image: "🎧", category: "Электроника", inStock: true },
    { id: 2, name: "Смарт-часы Sport", price: 8990, originalPrice: 12990, discount: 30, image: "⌚", category: "Электроника", inStock: true },
    { id: 3, name: "Рюкзак городской", price: 2490, image: "🎒", category: "Аксессуары", inStock: true },
    { id: 4, name: "Термокружка 500мл", price: 1290, originalPrice: 1790, discount: 25, image: "☕", category: "Товары для дома", inStock: true },
    { id: 5, name: "Портативная колонка", price: 3490, image: "🔊", category: "Электроника", inStock: true },
    { id: 6, name: "Фитнес-браслет", price: 2990, originalPrice: 4490, discount: 35, image: "📱", category: "Электроника", inStock: false },
  ];

  const categories = [
    { name: "Электроника", icon: "Smartphone", color: "bg-blue-100 text-blue-600" },
    { name: "Одежда", icon: "ShoppingBag", color: "bg-purple-100 text-purple-600" },
    { name: "Дом", icon: "Home", color: "bg-green-100 text-green-600" },
    { name: "Спорт", icon: "Dumbbell", color: "bg-orange-100 text-orange-600" },
  ];

  const promoCodes = {
    "WELCOME20": 20,
    "SALE10": 10,
    "VIP30": 30,
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleFavorite = (productId: number) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code as keyof typeof promoCodes]) {
      setAppliedPromo({ code, discount: promoCodes[code as keyof typeof promoCodes] });
    } else {
      setAppliedPromo(null);
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const promoDiscount = appliedPromo ? (subtotal * appliedPromo.discount) / 100 : 0;
    return { subtotal, promoDiscount, total: subtotal - promoDiscount };
  };

  const renderHome = () => (
    <div className="pb-20 px-4">
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white mb-6 mt-4">
        <h2 className="text-2xl font-bold mb-2">Скидки до 30%</h2>
        <p className="text-blue-100 mb-4">На всю электронику</p>
        <Button variant="secondary" size="sm">Смотреть товары</Button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Категории</h3>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentScreen("catalog")}
              className="flex flex-col items-center gap-2 hover-scale"
            >
              <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center`}>
                <Icon name={cat.icon} size={24} />
              </div>
              <span className="text-xs text-center">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Специальные предложения</h3>
          <Button variant="ghost" size="sm" onClick={() => setCurrentScreen("catalog")}>
            Все <Icon name="ChevronRight" size={16} className="ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map(product => (
            <Card key={product.id} className="p-3 hover-scale cursor-pointer">
              <div className="text-5xl mb-3 text-center">{product.image}</div>
              {product.discount && (
                <Badge className="mb-2 bg-red-500">{product.discount}%</Badge>
              )}
              <h4 className="font-medium text-sm mb-2 line-clamp-2 h-10">{product.name}</h4>
              <div className="flex flex-col gap-1 mb-3">
                <span className="font-bold text-lg">{product.price} ₽</span>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">{product.originalPrice} ₽</span>
                )}
              </div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => addToCart(product)}
              >
                <Icon name="ShoppingCart" size={16} className="mr-1" />
                В корзину
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCatalog = () => (
    <div className="pb-20 px-4">
      <div className="sticky top-0 bg-background z-10 py-4">
        <h2 className="text-2xl font-bold mb-4">Каталог</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button variant="default" size="sm">Все</Button>
          <Button variant="outline" size="sm">Электроника</Button>
          <Button variant="outline" size="sm">Аксессуары</Button>
          <Button variant="outline" size="sm">Дом</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        {products.map(product => (
          <Card key={product.id} className="p-3 relative">
            <button 
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center z-10"
            >
              <Icon 
                name={favorites.includes(product.id) ? "Heart" : "Heart"} 
                size={18}
                className={favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
            </button>
            
            <div className="text-5xl mb-3 text-center">{product.image}</div>
            {product.discount && (
              <Badge className="mb-2 bg-red-500">{product.discount}%</Badge>
            )}
            {!product.inStock && (
              <Badge variant="secondary" className="mb-2">Нет в наличии</Badge>
            )}
            <h4 className="font-medium text-sm mb-2 line-clamp-2 h-10">{product.name}</h4>
            <div className="flex flex-col gap-1 mb-3">
              <span className="font-bold text-lg">{product.price} ₽</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">{product.originalPrice} ₽</span>
              )}
            </div>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
            >
              <Icon name="ShoppingCart" size={16} className="mr-1" />
              {product.inStock ? "В корзину" : "Недоступно"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCart = () => {
    const { subtotal, promoDiscount, total } = calculateTotal();

    return (
      <div className="pb-32 px-4">
        <h2 className="text-2xl font-bold mb-4 mt-4">Корзина</h2>
        
        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-muted-foreground mb-4">Корзина пуста</p>
            <Button onClick={() => setCurrentScreen("catalog")}>
              Перейти к покупкам
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              {cart.map(item => (
                <Card key={item.id} className="p-4">
                  <div className="flex gap-4">
                    <div className="text-4xl">{item.image}</div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{item.name}</h4>
                      <p className="font-bold text-lg">{item.price} ₽</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted-foreground"
                    >
                      <Icon name="X" size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 mt-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <span className="font-medium w-8 text-center">{item.quantity}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                    <span className="ml-auto font-semibold">{item.price * item.quantity} ₽</span>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-4 mb-4">
              <h3 className="font-semibold mb-3">Промокод</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="Введите промокод"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={applyPromoCode}>Применить</Button>
              </div>
              {appliedPromo && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="CheckCircle2" size={20} className="text-green-600" />
                    <span className="text-sm font-medium">Промокод {appliedPromo.code} применён</span>
                  </div>
                  <span className="text-green-600 font-semibold">-{appliedPromo.discount}%</span>
                </div>
              )}
              <div className="mt-3 text-xs text-muted-foreground">
                Доступные промокоды: WELCOME20, SALE10, VIP30
              </div>
            </Card>

            <Card className="p-4 bg-secondary/30">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span className="font-medium">{subtotal} ₽</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Скидка по промокоду</span>
                    <span className="font-medium">-{promoDiscount} ₽</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Итого</span>
                  <span>{total} ₽</span>
                </div>
              </div>
              <Button className="w-full" size="lg">
                Оформить заказ
              </Button>
            </Card>
          </>
        )}
      </div>
    );
  };

  const renderFavorites = () => {
    const favoriteProducts = products.filter(p => favorites.includes(p.id));

    return (
      <div className="pb-20 px-4">
        <h2 className="text-2xl font-bold mb-4 mt-4">Избранное</h2>
        
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <p className="text-muted-foreground mb-4">Нет избранных товаров</p>
            <Button onClick={() => setCurrentScreen("catalog")}>
              Найти товары
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {favoriteProducts.map(product => (
              <Card key={product.id} className="p-3 relative">
                <button 
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center z-10"
                >
                  <Icon name="Heart" size={18} className="fill-red-500 text-red-500" />
                </button>
                
                <div className="text-5xl mb-3 text-center">{product.image}</div>
                {product.discount && (
                  <Badge className="mb-2 bg-red-500">{product.discount}%</Badge>
                )}
                <h4 className="font-medium text-sm mb-2 line-clamp-2 h-10">{product.name}</h4>
                <div className="flex flex-col gap-1 mb-3">
                  <span className="font-bold text-lg">{product.price} ₽</span>
                  {product.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">{product.originalPrice} ₽</span>
                  )}
                </div>
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                >
                  <Icon name="ShoppingCart" size={16} className="mr-1" />
                  {product.inStock ? "В корзину" : "Недоступно"}
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderProfile = () => (
    <div className="pb-20 px-4">
      <div className="text-center py-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-blue-600 mx-auto mb-4 flex items-center justify-center text-white text-4xl">
          👤
        </div>
        <h2 className="text-2xl font-bold">Иван Иванов</h2>
        <p className="text-muted-foreground">ivan@example.com</p>
      </div>

      <div className="space-y-2 mt-6">
        <Card className="p-4 flex items-center justify-between hover-scale cursor-pointer" onClick={() => setCurrentScreen("orders")}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon name="Package" size={20} className="text-primary" />
            </div>
            <span className="font-medium">Мои заказы</span>
          </div>
          <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
        </Card>

        <Card className="p-4 flex items-center justify-between hover-scale cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Icon name="CreditCard" size={20} className="text-purple-600" />
            </div>
            <span className="font-medium">Способы оплаты</span>
          </div>
          <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
        </Card>

        <Card className="p-4 flex items-center justify-between hover-scale cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Icon name="MapPin" size={20} className="text-green-600" />
            </div>
            <span className="font-medium">Адреса доставки</span>
          </div>
          <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
        </Card>

        <Card className="p-4 flex items-center justify-between hover-scale cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Icon name="Settings" size={20} className="text-orange-600" />
            </div>
            <span className="font-medium">Настройки</span>
          </div>
          <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
        </Card>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="pb-20 px-4">
      <h2 className="text-2xl font-bold mb-4 mt-4">Мои заказы</h2>
      
      <div className="space-y-3">
        <Card className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold">Заказ #12345</p>
              <p className="text-sm text-muted-foreground">15 ноября 2025</p>
            </div>
            <Badge className="bg-green-500">Доставлен</Badge>
          </div>
          <div className="flex gap-2 mb-3">
            <span className="text-3xl">🎧</span>
            <span className="text-3xl">⌚</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">2 товара</span>
            <span className="font-bold">13 980 ₽</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-semibold">Заказ #12344</p>
              <p className="text-sm text-muted-foreground">12 ноября 2025</p>
            </div>
            <Badge className="bg-blue-500">В пути</Badge>
          </div>
          <div className="flex gap-2 mb-3">
            <span className="text-3xl">🎒</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">1 товар</span>
            <span className="font-bold">2 490 ₽</span>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSearch = () => (
    <div className="pb-20 px-4">
      <div className="sticky top-0 bg-background z-10 py-4">
        <h2 className="text-2xl font-bold mb-4">Поиск</h2>
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Найти товары..." className="pl-10" />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-3">Популярные запросы</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="cursor-pointer hover-scale">наушники</Badge>
          <Badge variant="secondary" className="cursor-pointer hover-scale">смарт-часы</Badge>
          <Badge variant="secondary" className="cursor-pointer hover-scale">рюкзак</Badge>
          <Badge variant="secondary" className="cursor-pointer hover-scale">колонка</Badge>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="pb-20 px-4">
      <h2 className="text-2xl font-bold mb-4 mt-4">Уведомления</h2>
      
      <div className="space-y-3">
        <Card className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Icon name="CheckCircle2" size={20} className="text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Заказ доставлен</p>
              <p className="text-sm text-muted-foreground">Ваш заказ #12345 успешно доставлен</p>
              <p className="text-xs text-muted-foreground mt-2">2 часа назад</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Icon name="Package" size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Заказ в пути</p>
              <p className="text-sm text-muted-foreground">Заказ #12344 передан курьеру</p>
              <p className="text-xs text-muted-foreground mt-2">5 часов назад</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Icon name="Tag" size={20} className="text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium mb-1">Новая акция!</p>
              <p className="text-sm text-muted-foreground">Скидки до 30% на электронику</p>
              <p className="text-xs text-muted-foreground mt-2">Вчера</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case "home": return renderHome();
      case "catalog": return renderCatalog();
      case "cart": return renderCart();
      case "favorites": return renderFavorites();
      case "profile": return renderProfile();
      case "orders": return renderOrders();
      case "search": return renderSearch();
      case "notifications": return renderNotifications();
      default: return renderHome();
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto relative">
      <div className="pb-safe">
        {renderScreen()}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t max-w-md mx-auto">
        <div className="grid grid-cols-5 h-16">
          <button 
            onClick={() => setCurrentScreen("home")}
            className={`flex flex-col items-center justify-center gap-1 ${currentScreen === "home" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon name="Home" size={22} />
            <span className="text-xs">Главная</span>
          </button>
          
          <button 
            onClick={() => setCurrentScreen("catalog")}
            className={`flex flex-col items-center justify-center gap-1 ${currentScreen === "catalog" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon name="Grid3x3" size={22} />
            <span className="text-xs">Каталог</span>
          </button>
          
          <button 
            onClick={() => setCurrentScreen("cart")}
            className={`flex flex-col items-center justify-center gap-1 relative ${currentScreen === "cart" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon name="ShoppingCart" size={22} />
            {cart.length > 0 && (
              <span className="absolute top-1 right-1/4 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
            <span className="text-xs">Корзина</span>
          </button>
          
          <button 
            onClick={() => setCurrentScreen("favorites")}
            className={`flex flex-col items-center justify-center gap-1 relative ${currentScreen === "favorites" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon name="Heart" size={22} />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1/4 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
            <span className="text-xs">Избранное</span>
          </button>
          
          <button 
            onClick={() => setCurrentScreen("profile")}
            className={`flex flex-col items-center justify-center gap-1 ${currentScreen === "profile" ? "text-primary" : "text-muted-foreground"}`}
          >
            <Icon name="User" size={22} />
            <span className="text-xs">Профиль</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Index;
