import { TestBed, inject } from '@angular/core/testing';

import { CompileService } from './compile.service';

describe('CompileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompileService]
    });
  });

  it('should ...', inject([CompileService], (service: CompileService) => {
    expect(service).toBeTruthy();
  }));
});
