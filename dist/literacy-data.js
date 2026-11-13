import {literacyBooks,curriculumReadings} from './literacy-curriculum.js';
export {literacyBooks};
// Public-domain poems; notes, picture prompts and examples are original learning material.
const poem=(id,title,author,dynasty,lines,note,source,genre='古诗')=>({id,title,author,dynasty,lines,note,source,genre});
const wiki=title=>'https://zh.wikisource.org/wiki/'+encodeURIComponent(title);
const extraPoems=[
 poem('goose','咏鹅','骆宾王','唐',['鹅，鹅，鹅，','曲项向天歌。','白毛浮绿水，','红掌拨清波。'],'曲项：弯着脖子。留意白毛、绿水、红掌的颜色。',wiki('詠鵝')),
 poem('moon','静夜思','李白','唐',['床前明月光，','疑是地上霜。','举头望明月，','低头思故乡。'],'疑是：好像是。抬头看月亮，低头想故乡，动作里藏着思念。',wiki('靜夜思')),
 poem('spring','春晓','孟浩然','唐',['春眠不觉晓，','处处闻啼鸟。','夜来风雨声，','花落知多少。'],'晓：天亮。诗人用鸟声和风雨声写春天。',wiki('春曉_(孟浩然)')),
 poem('farmer','悯农（其二）','李绅','唐',['锄禾日当午，','汗滴禾下土。','谁知盘中餐，','粒粒皆辛苦。'],'想一想粮食从哪里来，体会劳动的辛苦。',wiki('憫農')),
 poem('tower','登鹳雀楼','王之涣','唐',['白日依山尽，','黄河入海流。','欲穷千里目，','更上一层楼。'],'欲：想要。穷：尽。登得更高，可以看得更远。',wiki('登鸛雀樓')),
 poem('waterfall','望庐山瀑布','李白','唐',['日照香炉生紫烟，','遥看瀑布挂前川。','飞流直下三千尺，','疑是银河落九天。'],'三千尺写出瀑布很高，并不是让我们实际测量。',wiki('望廬山瀑布')),
 poem('snow','江雪','柳宗元','唐',['千山鸟飞绝，','万径人踪灭。','孤舟蓑笠翁，','独钓寒江雪。'],'绝、灭：没有了。踪：脚印。想象安静的雪景。',wiki('江雪')),
 poem('village','村居','高鼎','清',['草长莺飞二月天，','拂堤杨柳醉春烟。','儿童散学归来早，','忙趁东风放纸鸢。'],'纸鸢就是风筝。找出诗中孩子们的活动。',wiki('村居_(高鼎)')),
 poem('willow','咏柳','贺知章','唐',['碧玉妆成一树高，','万条垂下绿丝绦。','不知细叶谁裁出，','二月春风似剪刀。'],'丝绦：丝带。诗人把春风想象成剪刀。',wiki('詠柳')),
 poem('pool','小池','杨万里','宋',['泉眼无声惜细流，','树阴照水爱晴柔。','小荷才露尖尖角，','早有蜻蜓立上头。'],'留意泉水、树影、小荷、蜻蜓这些小小的景物。',wiki('小池_(楊萬里)')),
 poem('boat','池上','白居易','唐',['小娃撑小艇，','偷采白莲回。','不解藏踪迹，','浮萍一道开。'],'不解：不懂得。浮萍分开的水路留下了小艇的踪迹。',wiki('池上')),
 poem('temple','夜宿山寺','李白','唐',['危楼高百尺，','手可摘星辰。','不敢高声语，','恐惊天上人。'],'危楼：高楼。诗人用大胆的想象写楼很高。',wiki('夜宿山寺')),
 poem('jiangnan','忆江南（其一）','白居易','唐',['江南好，','风景旧曾谙。','日出江花红胜火，','春来江水绿如蓝。','能不忆江南？'],'谙：熟悉。这是一首词，长短句一起写江南的美景。','https://cd.edb.gov.hk/chi/resource/ncs/download/js_list/JS_yijiangnan.pdf','词')
];
// Stable reading IDs preserve existing learned marks and dictation drafts.
export const poems=[...extraPoems,...curriculumReadings.filter(p=>p.title&&!extraPoems.some(old=>old.id===p.id))].map(p=>{
 const placement=curriculumReadings.find(item=>item.id===p.id);
 if(!placement)return {...p,kind:'extra'};
 const book=literacyBooks.find(b=>b.id===placement.book);
 return {...p,...placement,source:book.source};
});
export const readingsFor=(book,kind='all',unit='all')=>poems.filter(p=>book==='extra'?p.kind==='extra':p.book===book&&(kind==='all'||p.kind===kind)&&(unit==='all'||p.unit===Number(unit))).sort((a,b)=>(a.unit||0)-(b.unit||0)||(a.page||0)-(b.page||0));
export const readingLocation=p=>p.book?`${literacyBooks.find(b=>b.id===p.book).title} · ${p.kind==='garden'?'语文园地'+'一二三四五六七八'[p.unit-1]+' · 日积月累':'第'+p.unit+'单元 · 课文'} · 第${p.page}页`:'课外积累';
export const pictures=[
 {id:'umbrella',title:'雨中的一把伞',image:'literacy/umbrella.svg',alt:'下雨的路上，两个孩子靠近同一把伞，一人把伞往同伴方向移。',questions:['什么时间、在哪里？','图里有谁，天气怎样？','拿伞的孩子做了什么？','你觉得同伴会说什么？'],words:['放学','雨点','靠近','一起'],sample:'放学时，天空下起了雨。小雨撑着伞，看见同学站在路边，便招手请他一起走。两个人靠近一些，共用一把伞。雨点落在伞上，他们慢慢走回家。'},
 {id:'tree',title:'给小树喝水',image:'literacy/tree.svg',alt:'草地上，一个孩子拿着水壶给刚种的小树浇水，旁边有小铲子和另一个孩子。',questions:['他们来到了哪里？','小树周围有什么？','两个孩子怎样合作？','他们盼望小树发生什么变化？'],words:['春天','树苗','合作','长大'],sample:'春天到了，两个小伙伴来到草地上种树。他们先把小树种好，再给它浇水。一个人扶着树苗，一个人提着水壶。他们希望小树快快长大，让这里多一片绿色。'},
 {id:'kite',title:'风筝飞起来了',image:'literacy/kite.svg',alt:'公园草地上，一个孩子举着线轴向前跑，另一个孩子仰头看着空中的菱形风筝。',questions:['天气怎么样？','孩子们在哪里玩？','谁在做什么，风筝怎样飞起来？','他们的心情怎么样？'],words:['微风','草地','线轴','欢笑'],sample:'周末，微风轻轻吹着。两个孩子来到公园放风筝。一个孩子握着线轴向前跑，另一个孩子抬头看。风筝越飞越高，他们开心地笑了。'},
 {id:'clean',title:'公园里的小行动',image:'literacy/clean.svg',alt:'公园长椅旁有一个空饮料瓶，一个孩子弯腰捡瓶子，另一个孩子站在垃圾桶旁。',questions:['他们发现了什么？','两个孩子分别做了什么？','可以怎样把动作写清楚？','公园后来变得怎么样？'],words:['发现','弯腰','捡起','整洁'],sample:'两个小伙伴在公园散步，发现长椅旁有一个空瓶子。小明弯下腰，把瓶子捡起来，小红指了指旁边的垃圾桶。他们把垃圾放好，让公园又变得整洁了。'},
 {id:'cat',title:'树下的小猫',image:'literacy/cat.svg',alt:'树下的小猫坐在纸箱边，两个孩子蹲在不远处观察，一个孩子指向旁边走来的大人。',questions:['孩子们在哪里看见了什么？','小猫看起来怎么样？','他们怎样请大人帮忙？','故事接下来可能怎样发展？'],words:['树下','发现','轻声','帮忙'],sample:'两个孩子在树下发现了一只小猫。小猫坐在纸箱旁，轻轻叫着。他们没有随便抱它，而是请附近的大人帮忙。大家一起看看，能不能找到照顾小猫的人。'},
 {id:'books',title:'一起整理图书',image:'literacy/books.svg',alt:'教室里，两个孩子把桌上的书一本本摆进书架，桌上还剩几本书。',questions:['他们在什么地方？','桌上和书架上有什么？','两个人是怎样整理的？','你想对他们说什么？'],words:['教室','图书','分类','整齐'],sample:'午休前，两个同学一起整理图书角。他们把桌上的书按大小分好，再一本本放进书架。过了一会儿，书架整齐了，桌子也干净了。他们约好以后看完书都放回原处。'}
];
const radical=(id,shape,name,parent,examples,others,hint)=>({id,shape,name,parent,examples:examples.split(''),others:others.split(''),hint});
export const radicals=[
 radical('water','氵','三点水','水','河海清','树妈','常在字的左边，很多带氵的字与水有关。'),
 radical('hand','扌','提手旁','手','打拍抱','河松','很多带扌的字表示手的动作。'),
 radical('person','亻','单人旁','人','你他住','清叶','常在左边，可以和人的活动联系起来记。'),
 radical('mouth','口','口字旁','口','吃唱叫','松河','注意口字旁与包围在外面的囗不同。'),
 radical('wood','木','木字旁','木','林树松','海唱','木作左偏旁时，最后一笔常变成点。'),
 radical('sun','日','日字旁','日','晴时晚','河树','日字旁常与时间、光亮有关。'),
 radical('grass','艹','草字头','艸','花草苗','河时','常在字的上方，许多例字表示植物。'),
 radical('roof','宀','宝盖头','宀','家安字','打海','看起来像屋顶，常在字的上面。'),
 radical('heart-side','忄','竖心旁','心','快怕情','打河','忄是心的变形，常和心情有关。'),
 radical('speech','讠','言字旁','言','说话语','海林','很多例字与说话、语言有关。'),
 radical('silk','纟','绞丝旁','糸','红绿线','海时','纟是简化形，许多例字与丝线有关。'),
 radical('woman','女','女字旁','女','妈姐妹','河松','观察女作偏旁时的笔形变化。'),
 radical('dog','犭','反犬旁','犬','猫狗狼','河松','犭是犬的变形，许多例字表示动物。'),
 radical('food','饣','食字旁','食','饭饱饿','林海','饣是简化形，许多例字与吃食有关。'),
 radical('metal','钅','金字旁','金','铁钉铜','海时','钅是简化形，许多例字与金属有关。'),
 radical('fire-bottom','灬','四点底','火','热煮点','海林','灬常在字的下方，是火的一种变形。'),
 radical('rain','雨','雨字头','雨','雪雷雾','树唱','雨作字头时，形状会比独体字更扁一些。'),
 radical('heart','心','心字底','心','想忘思','海林','常在字的下面，留意与忄的关系。'),
 radical('eye','目','目字旁','目','眼睛盯','河树','目里面有两横，不要写成日。'),
 radical('foot','⻊','足字旁','足','跑跳踢','海时','足作左偏旁时下部笔形会变化。'),
 radical('insect','虫','虫字旁','虫','蚂蚁蜘','林海','许多例字与小动物有关，但不能只凭字义猜。'),
 radical('earth','土','提土旁','土','地场城','海唱','土在左边时，末笔常写成提。'),
 radical('fire','火','火字旁','火','灯炒烧','海林','观察火作偏旁时的笔形。'),
 radical('shell','贝','贝字旁','贝','财购贩','海松','不少例字与钱财、买卖有关。')
];
export const literacyAudio=[...poems.flatMap(p=>p.lines),...radicals.flatMap(r=>r.examples)];
