import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CoffeeService } from './coffee.service';

describe('CoffeeService', () => {
  let service: CoffeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CoffeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
