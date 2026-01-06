import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { faCar, faShoppingCart, faUser, faBell, faSearch, faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  faCar = faCar;
  faShoppingCart = faShoppingCart;
  faUser = faUser;
  faBell = faBell;
  faSearch = faSearch;
  faBars = faBars;
  
  cartItemCount = 0;
  isMenuCollapsed = true;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItemCount = items.length;
    });
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }

  searchCars(searchTerm: string): void {
    if (searchTerm.trim()) {
      this.router.navigate(['/cars'], { queryParams: { search: searchTerm } });
    }
  }
}