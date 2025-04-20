import { createCanvas } from '@napi-rs/canvas';

export default defineEventHandler(async (event) => {

    const text: string = `You're Invited!!`;
    const subtext: string =  `View shared moments and start contributing your own!`;
    const topText: string = `LUMORA`; 

    const width = 1200;
    const height = 500;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#EAE4DD'); 
    gradient.addColorStop(1, '#e5e7eb'); 
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#1f2937'; 
    ctx.font = 'bold 28px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top'; 
    ctx.fillText(topText, 50, 50);

    
    ctx.fillStyle = '#756145'; 
    ctx.font = 'bold 90px "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle'; 
    ctx.fillText(text, 50, height / 2);

    ctx.fillStyle = '#1f2937'; 
    ctx.font = '36px "Helvetica Neue", Arial, sans-serif';
    ctx.fillText(subtext, 50, height / 2 + 90);

    setHeader(event, 'Content-Type', 'image/webp');
    return canvas.toBuffer('image/png');
});