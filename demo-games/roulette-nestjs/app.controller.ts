import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/play')
  playRoulette(@Body('number') number: number): string {
    // Generate a random number to determine the outcome of the game
    const outcome = Math.floor(Math.random() * 36);

    // Check if the player won or lost the bet
    if (number === outcome) {
      return 'You won!';
    } else {
      return 'You lost.';
    }
  }
}
