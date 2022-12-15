import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  playRoulette(number: number): string {
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
