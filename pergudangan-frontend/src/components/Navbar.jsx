import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from "@shadcn/ui/navigation-menu";

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center mb-6 w-full bg-black max-h-16 p-4 px-12">
            <div onClick={() => window.location.href = '/dashboard'} className="cursor-pointer">
                <h1 className="text-3xl text-white font-bold">PERGUDANGAN</h1>
            </div>
            <NavigationMenu>
                <NavigationMenuItem>
                    <NavigationMenuLink className="text-white" href="/dashboard">Barang</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className="text-white" href="/dashboard/kategori">Kategori</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className="text-white" href="/dashboard/supplier">Suplier</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink className="text-white" href="/dashboard/transaction">Transaction</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenu>
        </nav>
    );
}

export default Navbar;