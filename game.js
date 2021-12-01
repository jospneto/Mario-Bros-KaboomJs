kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0, 0, 0, 1],
})

let isJumping = true
let isBig = false

loadRoot('https://i.imgur.com/')

loadSprite('coin', 'wbKxhcd.png')
loadSprite('evil-shroom', 'LmseqUG.png')
loadSprite('brick', 'pogC9x5.png')
loadSprite('block', 'M6rwarW.png')
loadSprite('mario', 'Wb1qfhK.png')
loadSprite('mushroom', '0wMd92p.png')
loadSprite('surprise', 'gesQ1KP.png')
loadSprite('unboxed', 'bdrLpi6.png')
loadSprite('pipe-top-left', 'ReTPiWY.png')
loadSprite('pipe-top-rigth', 'hj2GK4n.png')
loadSprite('pipe-bottom-left', 'c1cYSbt.png')
loadSprite('pipe-bottom-rigth', 'nqQ79eI.png')

scene("game", () => {
    layer(['bg', 'obj', 'ui'], 'obj')

    const map = [
        '                                  ',
        '                                  ',
        '                                  ',
        '                                  ',
        '                                  ',
        '     %   =*=%=                    ',
        '                                  ',
        '                        -+        ',
        '                ^   ^   ()        ',
        '==========================   =====',
    ]

    const levelCfg = {
        with: 20,
        height: 20,
        '=': [sprite('block'), solid()],
        '$': [sprite('coin')],
        '%': [sprite('surprise'), solid(), 'coin-surprise'],
        '*': [sprite('mushroom'), solid(), 'mushroom-suprise'],
        '}': [sprite('unboxed'), solid()],
        '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
        ')': [sprite('pipe-bottom-rigth'), solid(), scale(0.5)],
        '-': [sprite('pipe-top-left'), solid(), scale(0.5)],
        '+': [sprite('pipe-top-rigth'), solid(), scale(0.5)],
        '^': [sprite('evil-shroom'), solid()],
        '#': [sprite('mushroom'), solid()],
    }

    const gameLevel = addLevel(map, levelCfg)

    const scoreLabel = add([
        text("Nivel 1"),
        pos(30, 6),
        layer('ui'),{
            value: 'Nivel 1'
        }
    ])

    const scoreLabel = add([
        text("Game Over"),
        pos(30, 6),
        layer('ui'),{
            value: 'Game Over'
        }
    ])

    add([text('nivel' + 'Nivel 1', pos(30,6))])

    function big(){
        return{
            isBig(){
                return isBig
            },
            smallify(){
                this.scale = vec2(1)
                isBig = false
            },
            biggify(){
                this.scale = vec2(1.5)
                isBig = true
            }
        }
    }

    const player = add([
        sprite('mario'), solid(),
        pos(30, 0),
        body(),
        big(),
        origin('bot')
    ])

    const MOVE_SPEED = 120
    const JUMP_FORCE = 360

    keyDown('left', () =>{
        player.flipX(true)
        player.move(-MOVE_SPEED, 0)
    })

    keyDown('right', () =>{
        player.flipX(false)
        player.move(MOVE_SPEED, 0)
    })

    keyPress('space', () =>{
        if(player.grounded()){
            player.jump(JUMP_FORCE)
            let isJumping = true
        }
    })

    action('evil-shroom', (obj) =>{
        obj.move(-20, 0)
    })

    player.action(() =>{
        if(player.grounded()){
            isJumping = false
        }
    })

    player.on('headbutt', (obj) =>{
        if(obj.is('coin-surprise')){
            gameLevel.spawn('$', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,1))
        }

        if(obj.is('mushroom-surprise')){
            gameLevel.spawn('#', obj.gridPos.sub(0,1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0,1))
        }
    })

    action('mushroom', (obj) =>{
        obj.move(20,0)
    })

    player.collides('mushroom', (obj) =>{
        destroy(obj)
        player.biggify()
    })

    player.collides('evil-shroom', (obj) =>{
        if(isJumping){
            destroy(obj)
        }else{
            if(isBig){
                player.smallify()
            }
        }
    })
})
go("game")