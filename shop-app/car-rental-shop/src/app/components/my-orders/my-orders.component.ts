import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { OrderEntity, OrderStatus, OrderCard } from '../../models/orderEntity.model';
import { faFilter, faSearch, faSync, faEye, faCalendar, faCar, faUser, faCreditCard, faCheckCircle, faTimesCircle, faClock, faTruck, faBox } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  orders: OrderEntity[] = [];
  filteredOrders: OrderEntity[] = [];
  isLoading = false;
  searchTerm = '';
  
  // Status filters
  statusFilters = [
    { value: 'ALL', label: 'All Orders', count: 0, active: true },
    { value: 'PENDING', label: 'Pending', count: 0, active: false },
    { value: 'CONFIRMED', label: 'Confirmed', count: 0, active: false },
    { value: 'PAID', label: 'Paid', count: 0, active: false },
    { value: 'ACTIVE', label: 'Active', count: 0, active: false },
    { value: 'COMPLETED', label: 'Completed', count: 0, active: false },
    { value: 'CANCELLED', label: 'Cancelled', count: 0, active: false }
  ];
  
  selectedStatus = 'ALL';
  
  // Icons
  faFilter = faFilter;
  faSearch = faSearch;
  faSync = faSync;
  faEye = faEye;
  faCalendar = faCalendar;
  faCar = faCar;
  faUser = faUser;
  faCreditCard = faCreditCard;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faClock = faClock;
  faTruck = faTruck;
  faBox = faBox;

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  get completedOrdersCount(): number {
  return this.orders.filter(order => order.status === OrderStatus.COMPLETED).length;
  }

  get activeOrdersCount(): number {
    return this.orders.filter(order => order.status === OrderStatus.ACTIVE).length;
  }

  get totalSpent(): number {
    return this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  loadOrders(): void {
    this.isLoading = true;
    
    // Get current user email from localStorage or auth service
    const userEmail = this.getCurrentUserEmail();
    
    this.orderService.getUserOrders(userEmail).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.filteredOrders = [...orders];
        this.updateStatusCounts();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.isLoading = false;
        this.toastr.error('Failed to load orders');
      }
    });
  }

  getCurrentUserEmail(): string {
    // Get from localStorage or auth service
    const userData = localStorage.getItem('car_rental_user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.email || user.username + '@example.com';
    }
    return 'demo@example.com';
  }

  updateStatusCounts(): void {
    this.statusFilters.forEach(filter => {
      if (filter.value === 'ALL') {
        filter.count = this.orders.length;
      } else {
        filter.count = this.orders.filter(order => order.status === filter.value).length;
      }
    });
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.statusFilters.forEach(filter => filter.active = filter.value === status);
    
    if (status === 'ALL') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === status);
    }
    
    // Apply search filter if any
    this.applySearchFilter();
  }

  applySearchFilter(): void {
    if (!this.searchTerm.trim()) {
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.filteredOrders.filter(order => 
      order.id.toString().includes(term) ||
      order.items.some(item => 
        item.carBrand.toLowerCase().includes(term) ||
        item.carModel.toLowerCase().includes(term)
      ) ||
      order.customer.firstName.toLowerCase().includes(term) ||
      order.customer.lastName.toLowerCase().includes(term)
    );
  }

  onSearch(): void {
    this.filterByStatus(this.selectedStatus);
  }

  refreshOrders(): void {
    this.loadOrders();
    this.toastr.info('Refreshing orders...');
  }

  getStatusIcon(status: OrderStatus): any {
    switch (status) {
      case OrderStatus.COMPLETED: return faCheckCircle;
      case OrderStatus.PAID: return faCreditCard;
      case OrderStatus.ACTIVE: return faTruck;
      case OrderStatus.CONFIRMED: return faBox;
      case OrderStatus.PENDING: return faClock;
      case OrderStatus.CANCELLED: return faTimesCircle;
      default: return faClock;
    }
  }

  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.COMPLETED: return 'success';
      case OrderStatus.PAID: return 'primary';
      case OrderStatus.ACTIVE: return 'info';
      case OrderStatus.CONFIRMED: return 'warning';
      case OrderStatus.PENDING: return 'secondary';
      case OrderStatus.CANCELLED: return 'danger';
      default: return 'secondary';
    }
  }

  getStatusBadgeClass(status: OrderStatus): string {
    const color = this.getStatusColor(status);
    return `badge bg-${color} text-${color === 'warning' ? 'dark' : 'white'}`;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getOrderNumber(id: number): string {
    return `ORD-${id.toString().padStart(6, '0')}`;
  }

  getTotalItems(order: OrderEntity): number {
    return order.items.length;
  }

  getMainCar(order: OrderEntity): string {
    if (order.items.length > 0) {
      const item = order.items[0];
      return `${item.carBrand} ${item.carModel}`;
    }
    return 'No car selected';
  }

  viewOrderDetails(orderId: number): void {
    // Navigate to order detail page or show modal
    this.toastr.info(`Viewing order #${orderId}`);
  }
}