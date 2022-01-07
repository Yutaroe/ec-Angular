import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';
import { AuthenService } from './authen.service';

describe('AuthenService', () => {
  let service: AuthenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule.forRoot([])],
    });
    service = TestBed.inject(AuthenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
