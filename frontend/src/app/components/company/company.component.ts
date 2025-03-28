import { Component } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent {

constructor(private companyService: CompanyService,
  private router: Router
) {}
companies: { id: number; name: string }[] = [];
companyId: number = 0;

ngOnInit(): void {
      this.getCompanies();
  
}
async getCompanies() {
  try {
    const data = await this.companyService.getCompanies();
    this.companies = Array.isArray(data) ? data.map(({ id, name }) => ({ id, name })) : [];
  } catch (error) {
    console.error("Error fetching companies", error);
    this.companies = []; 
  }
}

receiveCompany(valueEmitted: number) {
  this.companyId = valueEmitted;
}

onChange(event: Event) {
  const selectedValue = (event.target as HTMLSelectElement).value;
  this.companyId = Number(selectedValue);
  localStorage.setItem('companyId', JSON.stringify(this.companyId));
  this.router.navigate(['/announcements']);
}
}
