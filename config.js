const config = {
    pipe_spaceY: {
        _comment: '管子垂直间距',
        value: 200,
    },
    pipe_spaceX: {
        _comment: '管子水平间距',
        value: 100,
    },
    pvz_game_speed: {
        _comment: 'PvZ 游戏进程(%)',
        value: 100,
        min: 25,
        max: 200,
        step: 5,
    },
    pvz_zombie_speed: {
        _comment: 'PvZ 僵尸速度(%)',
        value: 55,
        min: 20,
        max: 150,
        step: 5,
    },
    pvz_sky_sun_rate: {
        _comment: 'PvZ 天降阳光速度(%)',
        value: 100,
        min: 25,
        max: 300,
        step: 5,
    },
    pvz_sunflower_rate: {
        _comment: 'PvZ 向日葵产阳光速度(%)',
        value: 100,
        min: 25,
        max: 300,
        step: 5,
    },
    pvz_fast_forward: {
        _comment: 'PvZ 快进倍数',
        value: 1,
        min: 1,
        max: 4,
        step: 1,
    },
}
