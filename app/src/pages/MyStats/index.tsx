import { useEffect, useState } from "react";
import axios from "axios";
import { useCollection } from "../../hooks/useCollection.ts";
import { IoLibraryOutline, IoHeartOutline, IoStatsChartOutline, IoTrendingUpOutline } from "react-icons/io5";

const MyStats = () => {
  const { albums, getAllUserAlbums } = useCollection();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    getAllUserAlbums();
    fetchWishlistCount();
  }, []);

  const fetchWishlistCount = async () => {
    try {
      const response = await axios.get(
        `/api/wishlists`,
        { withCredentials: true }
      );
      setWishlistCount(response.data.length);
    } catch (error) {
      console.error("Error fetching wishlist count:", error);
    }
  };

  const totalValue = albums.reduce((acc: number, item: any) => acc + (item.price || 0), 0);

  return (
    <div className="p-6 flex flex-col gap-8 bg-gray-900 min-h-full">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Tableau de bord</h1>
        <p className="text-gray-500 text-sm font-medium">L'aperçu de ta collection en chiffres.</p>
      </header>

      <main className="grid grid-cols-1 gap-4">
        {/* Collection Stat */}
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-3xl flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
            <IoLibraryOutline size={30} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Ma Collection</p>
            <p className="text-3xl font-bold text-white">{albums.length} <span className="text-sm font-normal text-gray-400">albums</span></p>
          </div>
        </div>

        {/* Wishlist Stat */}
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-3xl flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 bg-red-500/20 text-red-400 rounded-2xl flex items-center justify-center shrink-0">
            <IoHeartOutline size={30} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Ma Wishlist</p>
            <p className="text-3xl font-bold text-white">{wishlistCount} <span className="text-sm font-normal text-gray-400">souhaits</span></p>
          </div>
        </div>

        {/* Value Stat */}
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-3xl flex items-center gap-5 shadow-lg">
          <div className="w-14 h-14 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center shrink-0">
            <IoStatsChartOutline size={30} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-500">Valeur Totale</p>
            <p className="text-3xl font-bold text-white">{totalValue.toFixed(2)} <span className="text-sm font-normal text-gray-400">€</span></p>
          </div>
        </div>

        {/* Placeholder for future growth */}
        <div className="bg-[#f1c40f]/5 border border-[#f1c40f]/20 p-6 rounded-3xl flex flex-col gap-4 shadow-lg mt-4 italic text-sm text-gray-400">
           <div className="flex items-center gap-2 text-[#f1c40f]">
              <IoTrendingUpOutline size={20} />
              <span className="font-bold uppercase tracking-widest text-[10px]">Prochainement</span>
           </div>
           Plus de stats détaillées (par genre, par année, top artistes...) arrivent bientôt !
        </div>
      </main>
    </div>
  );
};

export default MyStats;
