//────────────────────────────────────────────────────────初期設定
var SCREEN_WIDTH = 400;
var SCREEN_HEIGHT = 600;
var speed = 90
var now = 0
var flag = 0
var debug = 1
var hold = 0
var cc = 0
var combo = 1
var combo_ct = 0
var music = 1

var time = 0
var tex = ["","","","","",""]
var dance = ["セイッ！","ハァ～","フンッ","ホーゥ","ドゥードゥー","ドンドコドンドコ","ソロリソロリ……","ブレイクダンス！",
			"ホアアアアアア！！","ハエ～"
			]

var st = [1,20,20,10,10,10,0]//0LV 1HP 2MHP 3AT 4DF 5SP 6exp
var fl = [1]//フロア
var monum = 0 //敵モンスター情報
var mohp = 0 //敵モンスターHP
var bt_ct = 0
var shake = 0

var boname = new Array()
boname[0] = ["冒険","ver0.3","状態","説明"]
boname[1] = ["進む","戻る","-","踊る"]
boname[3] = ["戻る","踊る","踊る","踊る"]
boname[10] = ["攻撃","-","-","踊る"]

var bot = new Array()

window.addEventListener('load', init);

//────────────────────────────────────────────────────────ロード
function init() {
	canvas = document.getElementById('maincanvas');
	canvas.width = SCREEN_WIDTH;
	canvas.height = SCREEN_HEIGHT;

	//window.addEventListener('keydown', keydown);
	window.addEventListener('keyup', keyup);
	
	//クリック処理
	window.addEventListener("mousedown", keydown);

	window.addEventListener("blur", () => {
		game_over()
	  });

	var stage = new createjs.Stage(canvas);
	stage.enableMouseOver();
	
	//──────────────────────────────────効果音
	var se = new Array()
	se[1] = new Audio("se/push.mp3");
	se[2] = new Audio("se/push.mp3");
	se[3] = new Audio("se/swing.mp3");
	se[4] = new Audio("se/move.mp3");
	se[5] = new Audio("se/down.mp3");
	se[10] = new Audio("se/knife1.mp3");
	se[11] = new Audio("se/knife2.mp3");
	se[20] = new Audio("se/hit1.mp3");
	se[21] = new Audio("se/hit2.mp3");
	se[22] = new Audio("se/hit3.mp3");


	//背景
	stage_back = new createjs.Shape();
	stage_back.graphics
			.setStrokeStyle(2)
			.beginStroke('#2299cc')
			.beginFill("#1D1D1D")
			.drawRoundRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 4);
	stage.addChild(stage_back);

	//ボタン作成
	make_box(0,SCREEN_WIDTH / 2 - 190,10,380,50,"ステータス",0,0,0)
	make_box(1,SCREEN_WIDTH / 2 - 190,70,380,300,"画面",0,0,0)
	make_box(3,SCREEN_WIDTH / 2 - 190,440,380,150,"ログ",0,0,0)
	make_box(11,SCREEN_WIDTH / 2 - 190,380,95,50,"↑\nSTART",0,0,0)
	make_box(12,SCREEN_WIDTH / 2 - 95,380,95,50,"↑\nSHOP",0,0,0)
	make_box(13,SCREEN_WIDTH / 2 + 0,380,95,50,"↑\nSTATUS",0,0,0)
	make_box(14,SCREEN_WIDTH / 2 + 95,380,95,50,"↑\nDAMAGE",0,0,0)
	make_box(2,SCREEN_WIDTH / 2 - 190,380,380,50,"",0,0,0)//タイミングバー

	//タイミングバーにアイコン付与
	bot[2][5] = new createjs.Bitmap("img/50_atack.png")
	bot[2][5].visible = 0
	bot[2][5].y = 5
	bot[2][0].addChild(bot[2][5]);

	bot[2][6] = new createjs.Bitmap("img/51_def.png")
	bot[2][6].y = 5
	bot[2][6].visible = 1
	bot[2][0].addChild(bot[2][6]);	

	//ログウィンドウの整備
	bot[3][3].textAlign = "left"
	bot[3][3].x = 10
	bot[3][3].y = 35

	bot[2][0].visible = false

	//背景設定
	var back = new Array()
	back[0] = new createjs.Bitmap("img/00_start.png")
	back[1] = new createjs.Bitmap("img/01_dan.png")
	back[2] = new createjs.Bitmap("img/03_st.png")
	back[3] = new createjs.Bitmap("img/03_st.png")
	for (i = 0; i < back.length; i++) {
		stage.addChild(back[i]);
	}

	//モンスター設定
	var ene = new Array()
	ene[0] = new createjs.Bitmap("img/10_slime.png")
	ene[1] = new createjs.Bitmap("img/11_slime.png")	
	ene[2] = new createjs.Bitmap("img/12_bat.png")	
	ene[3] = new createjs.Bitmap("img/13_rat.png")	
	ene[4] = new createjs.Bitmap("img/14_knight.png")
	ene[5] = new createjs.Bitmap("img/15_bat.png")	
	for (i = 0; i < ene.length; i++) {
		ene[i].visible = 0
		ene[i].x = SCREEN_WIDTH / 2 - 175
		ene[i].y = 140
		stage.addChild(ene[i]);
	}

	var enest = new Array()
	enest[0] = [15,13,7,11,"スライム"]
	enest[1] = [25,15,8,11,"スライム2"]
	enest[2] = [35,18,9,11,"コウモリ"]
	enest[3] = [45,21,10,11,"ネズミ"]
	enest[4] = [55,24,11,11,"ナイト"]
	enest[5] = [65,27,12,11,"コウモリ2"]

	//ノーツ作成
	nots = new Array()
	for (i = 0; i < 5; i++) {
		nots[i] = new Array()
		nots[i][0] = new createjs.Container();
		nots[i][0].x = bot[2][0].x + 5
		nots[i][0].y = bot[2][0].y + 3
		stage.addChild(nots[i][0]);
		nots[i][1] = new createjs.Shape();
		nots[i][1].visible = 0
		nots[i][1].graphics
			.setStrokeStyle(2)
			.beginStroke('#aaaaaa')//枠色
			.beginFill("#222288")//中色
			.drawRoundRect(-8, 0, 14, 44, 4);
		nots[i][0].addChild(nots[i][1]);
		nots[i][2] = new createjs.Shape();
		nots[i][2].alpha = 0
		nots[i][2].graphics
			.setStrokeStyle(2)
			//.beginStroke('#aaaaaa')//枠色
			.beginFill("#ffffff")//中色
			.drawRoundRect(-8, 0, 14, 44, 4);
		nots[i][0].addChild(nots[i][2]);
	}

	//タイミングバー(クリック跡)
	bar2 = new Array()
	bar2[0] = new createjs.Container();
	bar2[0].x = bot[2][0].x + 5
	bar2[0].y = bot[2][0].y + 3
	
	stage.addChild(bar2[0]);
	bar2[1] = new createjs.Shape();
	bar2[1].visible = 0
	bar2[1].alpha = 1
	bar2[1].graphics
		.setStrokeStyle(2)
		.beginStroke('#aaaaaa')//枠色
		.beginFill("#ffffff")//中色
		.drawRoundRect(-3, 0, 6, 44, 4);
	bar2[0].addChild(bar2[1]);

	//タイミングバー
	bar = new createjs.Shape();
	bar.x = bot[2][0].x + 5
	bar.y = bot[2][0].y + 3
	bar.graphics
		.setStrokeStyle(2)
		.beginStroke('#ffffff')//枠色
		.beginFill("#882222")//中色
		.drawRoundRect(-3, 0, 6, 44, 4);
	stage.addChild(bar);

	//暗幕作成
	bla = new createjs.Shape();
	bla.x = bot[1][0].x
	bla.y = bot[1][0].y
	bla.alpha = 0
	bla.graphics
		.setStrokeStyle(2)
		.beginFill("#000000")//中色
		.drawRoundRect(1, 1, 378, 298, 1);
	stage.addChild(bla);

	//HPバー
	stb = new Array()
	stb[0] = new createjs.Container();
	stb[0].x = 10
	stb[0].y = 370
	stage.addChild(stb[0]);

	x = 380
	y = 10
	stb[1] = new createjs.Shape();
	stb[1].graphics
		.setStrokeStyle(2)
		.beginStroke('#eeeeee')//枠色
		.beginFill("#660000")//中色
		.drawRoundRect(0, 0, x, y, 1);
	stb[0].addChild(stb[1]);

	stb[2] = new createjs.Shape();
	stb[2].graphics
		.setStrokeStyle(2)
		//.beginStroke('#eeeeee')//枠色
		.beginFill("#ffffff")//中色
		.drawRoundRect(0, 0, x, y, 1);
	stb[2].alpha = 0
	stb[0].addChild(stb[2]);


	stb[3] = new createjs.Shape();
	stb[3].graphics
		.setStrokeStyle(2)
		.beginStroke('#aaaaaa')//枠色
		.drawRoundRect(0, 0, x, y, 1);
	stb[0].addChild(stb[3]);

	//攻撃エフェクト作成
	atef = new Array()
	atef[0] = new createjs.Bitmap("img/52_atef1.png")
	atef[0].x = SCREEN_WIDTH / 2
	atef[0].y = 250
	atef[0].regX = 185
	atef[0].regY = 18
	atef[0].alpha = 0
	atef[1] = new createjs.Bitmap("img/53_atef2.png")
	atef[1].x = SCREEN_WIDTH / 2
	atef[1].y = 250
	atef[1].regX = 185
	atef[1].regY = 42
	atef[1].alpha = 0
	stage.addChild(atef[0]);
	stage.addChild(atef[1]);

	//敵HPバー
	enb = new Array()
	enb[0] = new createjs.Container();
	enb[0].x = SCREEN_WIDTH / 2 - 50
	enb[0].y = 350
	enb[0].visible = 0
	stage.addChild(enb[0]);

	x = 100
	y = 5
	enb[1] = new createjs.Shape();
	enb[1].graphics
		.setStrokeStyle(2)
		.beginFill("#000000")//中色
		.drawRoundRect(0, 0, x, y, 1);
	enb[0].addChild(enb[1]);

	enb[2] = new createjs.Shape();
	enb[2].graphics
		.setStrokeStyle(2)
		.beginStroke('#aaaaaa')//枠色
		.beginFill("#880000")//中色
		.drawRoundRect(0, 0, x, y, 1);
	enb[0].addChild(enb[2]);

	enb[3] = new createjs.Shape();
	enb[3].graphics
		.setStrokeStyle(2)
		.beginStroke('#999999')//枠色
		.drawRoundRect(0, 0, x, y, 1);
	enb[0].addChild(enb[3]);

	//敵ダメージ表記
	dmt = new createjs.Text("918", "60px Yusei Magic", "#ffffff");
	dmt.x = SCREEN_WIDTH / 2 - 10
	dmt.y = 320
	dmt.alpha = 0
	dmt.textBaseline ="center";
	dmt.textAlign = "center";
	stage.addChild(dmt);

	add_log("行動を選んでください")
	get_back(0)
	get_bo_name()
	get_img()
	
	//─────────────────────────────────────────────────────────
	//
	//																										enter frame
	//
	//─────────────────────────────────────────────────────────
	
	createjs.Ticker.framerate = 60
	createjs.Ticker.addEventListener("tick",function(){
		//バーの往復
		if(flag == 0){
			time ++
			bar.x = bot[2][0].x + ((375  / speed) * time) + 5
			if(time >= speed){
				bar.alpha = 0.5
				bar2[1].visible = 0
				flag = 1//戻りタイム
				get_click()
				if(now != 0 && hold == 0){//呪い
					play_se(20)
					add_log("呪いのダメージ！")
					st[1] -= Math.floor(st[2] / 10)
					stb[2].alpha = 1
					if(st[1] <= 0){
						game_over()
					}
				}
			}
		}else{
			if(hold == 4){
				time -= 0.5
			}else{
				time -= 3
			}
			bar.x = bot[2][0].x + ((375  / speed) * time) + 5
			if(time <= 0){
				bar.alpha = 1
				hold = 0
				flag = 0//進みタイム
				bar2[1].visible = 1
				bar2[0].x = -100
			}
		}

		if(bla.alpha > 0){
			bla.alpha -= 0.1
		}
		if(stb[2].alpha > 0){
			stb[2].alpha -= 0.2
		}
		if(atef[0].alpha > 0){
			atef[0].alpha -= 0.1
		}
		if(atef[1].alpha > 0){
			atef[1].alpha -= 0.1
		}
		if(dmt.alpha > 0){
			dmt.alpha -= 0.05
			dmt.y -= 0.5
		}else{
			dmt.y = 320
		}
		for (i = 0; i < 5; i++) {
			if(nots[i][2].alpha > 0){
				nots[i][2].alpha -= 0.05
				nots[i][2].scaleX += 0.2
			}
		}
		if(shake > 0){
			shake --
			if(Math.floor(Math.random() * 4) == 0){
				ene[monum].x = (SCREEN_WIDTH / 2 - 175) + Math.floor(Math.random() * 10)
			}else if(Math.floor(Math.random() * 4) == 1){
				ene[monum].x = (SCREEN_WIDTH / 2 - 175) - Math.floor(Math.random() * 10)
			}else if(Math.floor(Math.random() * 4) == 2){
				ene[monum].y = 140 + Math.floor(Math.random() * 10)
			}else if(Math.floor(Math.random() * 4) == 3){
				ene[monum].y = 140 - Math.floor(Math.random() * 10)
			}
		}else{
			ene[monum].x = SCREEN_WIDTH / 2 - 175
			ene[monum].y = 140
		}
		get_img()
		stage.update();
	});

	//─────────────────────────────────────────────────────────
	//
	//																										function
	//
	//─────────────────────────────────────────────────────────

	//────────────────────────────────────────────────　クリック
	function keydown(event){
		if(flag == 0){
		if(now == 11 && bt_ct > 0){//─────────────────　戦闘(攻撃)
			bar2[0].x = bar.x
			hold = 99
			bt_ct --
			for (i = 0; i < 5; i++) { 
				if(bar.x >= nots[i][0].x - 10 && bar.x <= nots[i][0].x + 10){//攻撃がヒット
					play_se(Math.floor(Math.random() * 2) + 10)
					combo_ct ++
					hold = 98
					if(Math.floor(Math.random() * atef.length) == 0){
						atef[0].alpha = 1
						atef[0].rotation = Math.floor(Math.random() * 360)
					}else{
						atef[1].alpha = 1
						atef[1].rotation = Math.floor(Math.random() * 360)
					}					
					damage = get_damage(st[3],enest[monum][2])
					mohp -= damage
					dmt.text = damage
					dmt.alpha = 1
					nots[i][2].alpha = 1
					nots[i][2].scaleX = 1
					shake = 15
					enb[2].scaleX = mohp / enest[monum][0]
					if(mohp < 1){
						play_se(5)
						add_log(enest[monum][4]  + " を倒した")
						st[6] += Math.floor(fl[0] / 3) + 1
						if(st[6] > st[0] * 10){//レベルアップ
							st[6] = 0
							st[0] ++
							st[2] = 20 + (st[0] * 2)
							st[1] = st[2]
							st[3] = 10 + (st[0] * 3)
							st[4] = 10 + (st[0] * 1)
							st[5] = 10 + (st[0] * 1)
							add_log("レベルが" + st[0]  + " に上がった")
						}
						ene[monum].visible = 0
						bot[2][0].visible = 0
						enb[0].visible = 0
						bar2[0].x = -100
						make_tab(0)
						now = 1
						get_bo_name()
						hold = 99
					}
				}else{
					play_se(3)
				}
			}
		}else if(now == 12 && bt_ct > 0){//─────────────────　戦闘(防御)
			bar2[0].x = bar.x
			hold = 99
			bt_ct --
			for (i = 0; i < 5; i++) { 
				if(bar.x >= nots[i][0].x - 10 && bar.x <= nots[i][0].x + 10){
					play_se(4)
					damage = get_damage(enest[monum][1],st[4])
					hold = 98//少なくともどれか一つにあたった判定
					nots[i][2].alpha = 1
					nots[i][2].scaleX = 1
					add_log("回避した！")
				}
			}
			if(hold == 99){
				play_se(Math.floor(Math.random() * 3) + 20)
				damage = get_damage(enest[monum][1],st[4])
				st[1] -= damage
				add_log("直撃した！　" + damage + "　ダメージ")
				stb[2].alpha = 1
			}
			if(st[1] <= 0){
				game_over()
			}
		}else if(hold == 0){
			play_se(1)
			cc ++
			bar2[1].visible = 1
			bar2[0].x = bar.x
			if(get_hit(time) <= 25){
				hold = 1
			}else if(get_hit(time) <= 50){ 
				hold = 2
			}else if(get_hit(time) <= 75){ 
				hold = 3
			}else{
				hold = 4	
			}
			add_text(hold)
		}
		}
	}
	//────────────────────────────────────────────────　クリック処理
	function get_click(){
		if(now == 0){//───────────────────────　街
			if(hold == 1){
				add_log("ダンジョンに入りました")
				fl[0] = 1
				now = 1
				cc = 0
				get_bo_name()
				get_back(now)
			}else if(hold == 2){
			}else if(hold == 3){
				add_log("ステータス画面")
				now = 3
				get_bo_name()
				get_back(now)
			}else if(hold == 4){
				add_log("")
				add_log("指が疲れたら踊って時間を稼ごう")
				add_log("でないと呪いでダメージを受けるよ")
				add_log("冒険中は必ず行動し続けてね？")
			}
		}else if(now == 1){//─────────────────　ダンジョン
			if(hold == 1){
				fl[0] ++
				bla.alpha = 1
				if(Math.floor(Math.random() * 3) == 0){//戦闘開始
					monum = Math.floor(Math.random() * Math.floor((fl[0] / 10) + 1))
					add_text(monum)
					if(monum > enest.length){
						monum = Math.floor(Math.random() * enest.length)
					}
					mohp = enest[monum][0]//HP
					ene[monum].visible = 1
					enb[0].visible = 1
					enb[2].scaleX = 1
					combo_ct = 0
					bt_ct = 0
					now = 10
					add_log(enest[monum][4] + " が現れた")
					get_bo_name()
				}else{
					add_log("探索度 " + fl[0])
				}						
			}else if(hold == 2){
				fl[0] --
				if(fl[0] == 0){
					now = 0
					st[1] = st[2]
					add_log("街に戻りました")
					get_bo_name()
					get_back(now)
				}else{
					bla.alpha = 1
					add_log("探索度" + fl[0])
				}
			}else if(hold == 3){
			}else if(hold == 4){
				add_log(dance[(Math.floor(Math.random() * dance.length))])
			}
		}else if(now == 3){//─────────────────　ステータス
			hold = 1
			if(hold == 1){
				now = 0
				get_bo_name()
				get_back(now)
				add_log("行動を選んでください")
			}else if(hold == 2){
			}else if(hold == 3){
			}else if(hold == 4){
			}
		}else if(now == 10){//─────────────────　戦闘(行動選択)
			if(hold == 1){
				now = 11
				bot[2][0].visible = 1
				bot[2][5].visible = 1
				bot[2][6].visible = 0
				make_tab(combo)
				bt_ct = combo
			}else if(hold == 4){
				add_log(dance[(Math.floor(Math.random() * dance.length))])
			}
		}else if(now == 11){//─────────────────　戦闘(攻撃終了)
			if(combo_ct == combo){
				combo ++
				if(combo > 5){
					combo = 5
				}
			}else{
				combo = 1
			}
			combo_ct = 0
			now = 12//防御
			bar2[0].x = -100
			bot[2][5].visible = 0
			bot[2][6].visible = 1
			bt_ct = Math.floor(Math.random() * 4) + 1
			make_tab(bt_ct)
		}else if(now == 12){//─────────────────　戦闘(防御終了)
			now = 10
			bot[2][0].visible = 0
			make_tab(0)
			if(bt_ct > 0){
				st[1] -= get_damage(enest[monum][1],st[4] * 0.8) * bt_ct
				stb[2].alpha = 1
				add_log("追撃だ！　" + get_damage(enest[monum][1],st[4] * 0.8) * bt_ct + "　ダメージ")
				if(st[1] <= 0){
					game_over()
				}
			}
		}
	}

	//────────────────────────────────────────────────　タップ判定(100%に変換)
	function get_hit(hit_time) {
		return (100 / speed) * hit_time
	}
	//────────────────────────────────────────────────　ノーツ配置
	function make_tab(num){
		for (i = 0; i < 5; i++) { 
			nots[i][1].visible = 0//1回全部消す
			nots[i][0].x = -100
		}
		tabran = [1,-1]
		basex = bot[2][0].x + 30
		basep = 380 - 30
		if(num == 0){
		}else if(num == 1){
			nots[0][1].visible = true
			nots[0][0].x = basex + (basep / 2 * 1) + Math.floor(Math.random() * 100) * tabran[(Math.floor(Math.random() * 2))]
		}else if(num == 2){
			nots[0][1].visible = true
			nots[0][0].x = basex + (basep / 3 * 1) + Math.floor(Math.random() * 50) * tabran[(Math.floor(Math.random() * 2))]
			nots[1][1].visible = true
			nots[1][0].x = basex + (basep / 3 * 2) + Math.floor(Math.random() * 50) * tabran[(Math.floor(Math.random() * 2))]
		}else if(num == 3){
			nots[0][1].visible = true
			nots[0][0].x = basex + (basep / 4 * 1) + Math.floor(Math.random() * 20) * tabran[(Math.floor(Math.random() * 2))]
			nots[1][1].visible = true
			nots[1][0].x = basex + (basep / 4 * 2) + Math.floor(Math.random() * 20) * tabran[(Math.floor(Math.random() * 2))]
			nots[2][1].visible = true
			nots[2][0].x = basex + (basep / 4 * 3) + Math.floor(Math.random() * 20) * tabran[(Math.floor(Math.random() * 2))]
		}else if(num == 4){
			nots[0][1].visible = true
			nots[0][0].x = basex + (basep / 5 * 1)
			nots[1][1].visible = true
			nots[1][0].x = basex + (basep / 5 * 2)
			nots[2][1].visible = true
			nots[2][0].x = basex + (basep / 5 * 3)
			nots[3][1].visible = true
			nots[3][0].x = basex + (basep / 5 * 4)
		}else if(num == 5){
			nots[0][1].visible = true
			nots[0][0].x = basex + (basep / 6 * 1)
			nots[1][1].visible = true
			nots[1][0].x = basex + (basep / 6 * 2)
			nots[2][1].visible = true
			nots[2][0].x = basex + (basep / 6 * 3)
			nots[3][1].visible = true
			nots[3][0].x = basex + (basep / 6 * 4)
			nots[4][1].visible = true
			nots[4][0].x = basex + (basep / 6 * 5)
		}
		/*
		add_text("basex = " + basex)
		add_text("0 = " + nots[0].x)
		add_text("1 = " + nots[1].x)
		add_text("2 = " + nots[2].x)
		add_text("3 = " + nots[3].x)
		add_text("4 = " + nots[4].x)
		*/
	}

	function keyup(event){
		if(flag == 1){
			var key_code = event.keyCode;
			if(key_code == 32){//スペース
				//add_text("スペース")
				bot[2][2].visible = false;
			}
		}
	}

	//────────────────────────────────────────────────　ボタン作成
	function make_box(num,xpos,ypos,xsize,ysize,text,cl,ov,ou){

		bot[num] = new Array()

		bot[num][0] = new createjs.Container();
		bot[num][0].x = xpos
		bot[num][0].y = ypos
		stage.addChild(bot[num][0]);

		//下地
		bot[num][1] = new createjs.Shape();
		bot[num][1].graphics
			.setStrokeStyle(2)
			.beginStroke('#aaaaaa')//枠色
			.beginFill("#333333")//中色
			.drawRoundRect(0, 0, xsize, ysize, 1);
		bot[num][0].addChild(bot[num][1]);

		//選択
		bot[num][2] = new createjs.Shape();
		bot[num][2].visible = false
		bot[num][2].graphics
			.setStrokeStyle(2)
			.beginStroke('#882200')//枠色
			.beginFill("#444444")//中色
			.drawRoundRect(0, 0, xsize, ysize, 1);
		bot[num][0].addChild(bot[num][2]);	

		//文字
		bot[num][3] = new createjs.Text(text, "20px MagicZen Antique", "#ffffff");
		bot[num][3].x = xsize / 2
		bot[num][3].y = ysize / 2 +5
		bot[num][3].textBaseline ="center";
		bot[num][3].textAlign = "center";
		bot[num][0].addChild(bot[num][3]);
				
		//選択中
		bot[num][4] = new createjs.Shape();
		bot[num][4].visible = false
		bot[num][4].alpha = 0.5
		bot[num][4].graphics
			.setStrokeStyle(2)
			//.beginStroke('#ff0000')//枠色
			.beginFill("#999999")//中色
			.drawRoundRect(0, 0, xsize, ysize, 1);
		bot[num][0].addChild(bot[num][4]);

		//クリック処理
		if(cl == 1){
			bot[num][1].addEventListener("click", ()=>{
				add_text(num + " / クリック")
			})
		}
		if(ov == 1){
			bot[num][1].addEventListener("mouseover",()=>{
				bot[num][2].visible = true;
				add_text(num + " / オーバー")
			})
		}
		if(ou == 1){
			bot[num][1].addEventListener("mouseout",()=>{
				bot[num][2].visible = false;
				add_text(num + " / アウト")
			})	
		}
	}

	//────────────────────────────────────────────────　ボタン名更新
	function get_bo_name() {
		bot[11][3].text = boname[now][0]
		bot[12][3].text = boname[now][1]
		bot[13][3].text = boname[now][2]
		bot[14][3].text = boname[now][3]
	}

	//────────────────────────────────────────────────　背景更新
	function get_back(num) {
		for (i = 0; i < back.length; i++) {
			back[i].visible = false
		}
		back[num].x = bot[1][0].x + 5
		back[num].y = bot[1][0].y + 5
		back[num].visible = true
		bla.alpha = 1
	}

	//────────────────────────────────────────────────　画面更新
	function get_img() {
		stb[1].scaleX = st[1] / st[2]
		bot[0][3].text = "LV" + st[0] + " AT" + st[3] + " DF" + st[4] + " SP" + st[5] + " NEXT" + (st[0] * 10 - st[6])
		//bot[0][3].text = "com " + combo + " / com_ct " + combo_ct + " / bt_ct " + bt_ct
	}

	//────────────────────────────────────────────────　ログ更新
	function add_text(num) {
		if(debug == 1){
			console.log(num)
		}
	}

	function add_log(num) {
		tex.unshift(num)
		tex.pop()
		
		bot[3][3].text = ""
		for(i = 0; i < tex.length; i++){
			bot[3][3].text += tex[i] + "\n"
		}
	}
	//────────────────────────────────────────────────　ダメージ
	function get_damage(at,df) {
		if(Math.floor(at - df) < 1){
			return 1
		}else{
			return Math.floor((at - df))	
		}		
	}

	//────────────────────────────────────────────────　効果音再生
	function play_se(num) {
		if(music == 1){
			se[num].volume = 0.3
			se[num].currentTime = 0
			se[num].play()
		}
	}

	//────────────────────────────────────────────────　ゲームオーバー
	function game_over() {
		ene[monum].visible = 0
		bot[2][0].visible = 0
		enb[0].visible = 0
		bar2[0].x = -100
		ene[monum].visible = 0
		st[1] = st[2]
		now = 0
		make_tab(0)
		get_bo_name()
		get_back(now)
		add_log("あなたは倒れた")
	}
	
	
}