import { Application, Container, Sprite } from 'pixi.js';

export function LoadingIcon(
    app: Application,
    position: { x: number; y: number }
) {
    const container = new Container();
    container.position.set(position.x, position.y);
    app.stage.addChild(container);

    const size = 100;
    const ballAmount = 7;
    const balls: Sprite[] = [];

    for (let i = 0; i < ballAmount; i++) {
        const ball = Sprite.from('https://pixijs.com/assets/circle.png');
        ball.anchor.set(0.5);
        container.addChild(ball);
        ball.position.set(
            size / 2 + (Math.cos((i / ballAmount) * Math.PI * 2) * size) / 3,
            size / 2 + (Math.sin((i / ballAmount) * Math.PI * 2) * size) / 3,
        );
        balls.push(ball);
    }

    let phase = 0;

    const update = (delta: number): void => {
        // Update phase
        phase += delta / 60;
        phase %= Math.PI * 2;

        // Update ball scales
        balls.forEach((ball, i) => {
            const sin = Math.sin((i / ballAmount) * Math.PI - phase);
            // Multiply sin with itself to get steeper edges
            ball.scale.set(Math.abs(sin * sin * sin * 0.5) + 0.5);
        });
    };

    return { update, container };
}