
// import { Header } from "@/components/navigation/header"
import { FavoritesList } from "@/components/interactions/favorites-list"
import AuthGuard from "@/contexts/AuthGuard"

export default function FavoritesPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* <Header /> */}
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
          <FavoritesList />
        </div>
      </div>
    </AuthGuard>
  )
}
