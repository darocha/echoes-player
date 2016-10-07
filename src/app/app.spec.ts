import {
  inject,
  TestBed
} from '@angular/core/testing';

// Load the implementations that should be tested
import { App } from './app.component';
import { YoutubeSearch, YoutubePlayerService, NowPlaylistService } from './core/services';
import { PlayerActions } from './core/store/youtube-player.ts';
import { Notify } from "@ngrx/notify";
import { Store } from "@ngrx/store";

describe('App', () => {
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    let youtubePlayerService = jasmine.createSpyObj('YoutubePlayerService', [ 'playVideo' ]);
    youtubePlayerService.player$ = {};
    let notifyMock = {
      subscribe: () => {},
      requestPermission: () => notifyMock
    };
    spyOn(notifyMock, 'requestPermission').and.callThrough();

    return TestBed.configureTestingModule({
      providers: [
        App,
        { provide: YoutubeSearch, useClass: class YoutubeSearch {} },
        { provide: YoutubePlayerService, useValue: youtubePlayerService },
        { provide: PlayerActions, useValue: jasmine.createSpyObj('PlayerActions', ['playVideo']) },
        { provide: NowPlaylistService, useValue: jasmine.createSpyObj('NowPlaylistService', ['updateIndexByMedia']) },
        { provide: Notify, useValue: notifyMock },
        { provide: Store, useValue: jasmine.createSpyObj('Store', [ 'dispatch', 'subscribe' ]) }
      ]
    });
  });

  it('should define an app component', inject([ App ], (app) => {
    expect(app).toBeDefined();
  }));

  it('should create a reference to the player$ Observable', inject([ App ], (app) => {
    const expected = app.playerService.player$;
    const actual = app.player;
    expect(actual).toBe(expected);
  }));

  it('should request permission to show notifications', inject([ App, Notify ], (app, notify) => {
    const actual = notify.requestPermission;
    expect(actual).toHaveBeenCalled();
  }));
});
