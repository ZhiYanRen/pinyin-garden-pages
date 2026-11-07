/* 核验日期：2026-11-06。教材目录与词语表来自国家中小学智慧教育平台。
 * 只存听写所需的常用词及课目索引，不含课文、教材插图或教材页面。
 * 拼音为本应用标注；轻声不标调，一/不保留本调，朗读时允许自然变调。
 * source === 'supplement' 表示原创巩固词，不冒充教材词语表。
 */
const official = {
  g2a: { contentId: '2ce8f153-7bff-4c97-b6db-9aac414fea19', revision: '1787022982823', updated: '2026-08-18', pageOffset: 5 },
  g2b: { contentId: '0f93b83e-b3c2-4a5d-8acd-ea460ab962d4', revision: '1772437265301', updated: '2026-03-03', pageOffset: 5 }
};
const bookUrl = id => `https://basic.smartedu.cn/tchMaterial/detail?contentType=assets_document&contentId=${official[id].contentId}&catalogType=tchMaterial&subCatalog=tchMaterial`;
const pageUrl = (id, page) => `https://r1-ndr.ykt.cbern.com.cn/edu_product/esp/assets/${official[id].contentId}.t/zh-CN/${official[id].revision}/transcode/image/${page + official[id].pageOffset}.jpg`;
function terms(raw, source) {
  return raw.split(';').filter(Boolean).map(item => {
    const [text, pinyin] = item.trim().split('|');
    return { text, pinyin, source };
  });
}
function lesson(book, key, number, title, raw, page, extra = '') {
  const id = `${book}-${key}`;
  const primary = terms(raw, page ? 'textbook' : 'supplement');
  const added = terms(extra, 'supplement');
  return {
    id, number, title,
    words: [...primary, ...added].map((word, i) => ({ id: `${id}-w${i + 1}`, ...word })),
    note: page
      ? `教材词语表已核对官方电子教材第${page}页${added.length ? `；另有${added.length}个原创巩固词，已逐词标记` : ''}。拼音由本应用标注。`
      : '原创巩固词：按本课主题和常用字组词，不是教材词语表条目。',
    sourceUrl: page ? pageUrl(book, page) : bookUrl(book),
    sourcePage: page || null
  };
}
function unit(book, number, title, lessons, garden) {
  const chinese = '一二三四五六七八'[number - 1];
  return {
    id: `${book}-u${number}`, number, title,
    lessons: [...lessons, lesson(book, `garden${number}`, '园地', `语文园地${chinese} · 补充复习`, garden, 0)]
  };
}

export const curriculum = [
  {
    id: 'g2a', title: '二年级上册', edition: '统编语文 · 人民教育出版社 · 根据2022年版课程标准修订',
    verified: '2026-11-06', sourceUpdated: official.g2a.updated, sourceUrl: bookUrl('g2a'),
    note: '已核对官方现行电子教材的27个课目和236个词语表词。另含古诗组词、少量补充词与8组园地原创复习；补充词逐词标记。学校具体听写要求以老师安排为准。',
    units: [
      unit('g2a', 1, '第一单元 · 阅读', [
        lesson('g2a','l1','1','小蝌蚪找妈妈','妈妈|mā ma;他们|tā men;看见|kàn jiàn;我们|wǒ men;哪里|nǎ lǐ;那边|nà biān;雪白|xuě bái;过去|guò qù;孩子|hái zi;什么|shén me',116),
        lesson('g2a','l2','2','我是什么','太阳|tài yáng;天空|tiān kōng;一起|yī qǐ;冬天|dōng tiān;花朵|huā duǒ;池子|chí zi;江河|jiāng hé;海洋|hǎi yáng;许多|xǔ duō;田地|tián dì;工作|gōng zuò;办法|bàn fǎ;你们|nǐ men',116),
        lesson('g2a','l3','3','植物妈妈有办法','如果|rú guǒ;已经|yǐ jīng;告别|gào bié;四海为家|sì hǎi wéi jiā;自己|zì jǐ;出发|chū fā;动物|dòng wù;胆子|dǎn zi;肚子|dù zi;那里|nà lǐ;知识|zhī shi',116)
      ], '晴天|qíng tiān;雨水|yǔ shuǐ;雷声|léi shēng;白云|bái yún;大风|dà fēng;天气|tiān qì'),
      unit('g2a', 2, '第二单元 · 识字', [
        lesson('g2a','s1','识字1','场景歌','花园|huā yuán;飞鸟|fēi niǎo;红领巾|hóng lǐng jīn;欢笑|huān xiào',116,'队旗|duì qí;小桥|xiǎo qiáo'),
        lesson('g2a','s2','识字2','树之歌','杨树|yáng shù;树叶|shù yè;松柏|sōng bǎi;化石|huà shí;开花|kāi huā',116,'树木|shù mù'),
        lesson('g2a','s3','识字3','拍手歌','拍手|pāi shǒu;世界|shì jiè;云彩|yún cai;丛林|cóng lín;竹林|zhú lín;朋友|péng you;保护|bǎo hù',116),
        lesson('g2a','s4','识字4','田家四季歌','四季|sì jì;春风|chūn fēng;农事|nóng shì;月光|yuè guāng;身体|shēn tǐ;辛苦|xīn kǔ;心里|xīn lǐ;大家|dà jiā',116)
      ], '诚实|chéng shí;热情|rè qíng;帮助|bāng zhù;友爱|yǒu ài;丰收|fēng shōu;田园|tián yuán'),
      unit('g2a', 3, '第三单元 · 阅读', [
        lesson('g2a','l4','4','彩虹','天上|tiān shàng;美丽|měi lì;爸爸|bà ba;下来|xià lái;不用|bù yòng;高兴|gāo xìng;哥哥|gē ge;秋千|qiū qiān;彩云|cǎi yún',116),
        lesson('g2a','l5','5','去外婆家','宝贝|bǎo bèi;干活|gàn huó;回来|huí lái;一些|yī xiē;天气|tiān qì;欢快|huān kuài;它们|tā men;告诉|gào su;名字|míng zi;出门|chū mén',117),
        lesson('g2a','l6','6','数星星的孩子','星星|xīng xing;晚上|wǎn shang;无数|wú shù;奶奶|nǎi nai;中间|zhōng jiān;总是|zǒng shì;爷爷|yé ye;北边|běi biān;勺子|sháo zi;转动|zhuàn dòng;这个|zhè ge;后来|hòu lái',117)
      ], '图画|tú huà;唱歌|chàng gē;泥土|ní tǔ;钢琴|gāng qín;游戏|yóu xì;滑梯|huá tī'),
      unit('g2a', 4, '第四单元 · 阅读', [
        lesson('g2a','l7','7','古诗二首：登鹳雀楼、望庐山瀑布','高楼|gāo lóu;黄河|huáng hé;白日|bái rì;山川|shān chuān;香炉|xiāng lú;流水|liú shuǐ',0),
        lesson('g2a','l8','8','黄山奇石','那些|nà xiē;山顶|shān dǐng;山头|shān tóu;云海|yún hǎi;仙人|xiān rén;前方|qián fāng;仙女|xiān nǚ',117),
        lesson('g2a','l9','9','日月潭','山区|shān qū;群山|qún shān;树木|shù mù;灯光|dēng guāng;中午|zhōng wǔ;眼前|yǎn qián;细雨|xì yǔ;风光|fēng guāng;中外|zhōng wài',117),
        lesson('g2a','l10','10','葡萄沟','地方|dì fang;水果|shuǐ guǒ;月份|yuè fèn;枝叶|zhī yè;五光十色|wǔ guāng shí sè;好客|hào kè;老乡|lǎo xiāng;有的|yǒu de;城市|chéng shì;空气|kōng qì;水分|shuǐ fèn;这里|zhè lǐ;味道|wèi dao;有名|yǒu míng',117)
      ], '车票|chē piào;出行|chū xíng;火车|huǒ chē;风景|fēng jǐng;车站|chē zhàn;平安|píng ān'),
      unit('g2a', 5, '第五单元 · 阅读', [
        lesson('g2a','l11','11','坐井观天','坐井观天|zuò jǐng guān tiān;哪儿|nǎr;回答|huí dá;大话|dà huà;不过|bù guò;那么|nà me;抬头|tái tóu',117),
        lesson('g2a','l12','12','寒号鸟','当作|dàng zuò;前面|qián miàn;面对面|miàn duì miàn;出去|chū qù;过冬|guò dōng;知道|zhī dao;赶快|gǎn kuài;正好|zhèng hǎo;明天|míng tiān;清早|qīng zǎo;好像|hǎo xiàng;一样|yī yàng;天亮|tiān liàng;出来|chū lái',117),
        lesson('g2a','l13','13','我要的是葫芦','从前|cóng qián;以后|yǐ hòu;多么|duō me;那个|nà ge;叶子|yè zi;虫子|chóng zi;自言自语|zì yán zì yǔ;邻居|lín jū;奇怪|qí guài',117)
      ], '救火|jiù huǒ;汽车|qì chē;轮船|lún chuán;回答|huí dá;认真|rèn zhēn;观察|guān chá'),
      unit('g2a', 6, '第六单元 · 阅读', [
        lesson('g2a','l14','14','八角楼上','年代|nián dài;明亮|míng liàng;星星之火|xīng xīng zhī huǒ;中国|zhōng guó;胜利|shèng lì;道路|dào lù',117),
        lesson('g2a','l15','15','朱德的扁担','同志|tóng zhì;红军|hóng jūn;敌人|dí rén;生产|shēng chǎn;常常|cháng cháng;来回|lái huí;非常|fēi cháng;战士|zhàn shì;一块儿|yī kuàir;白天|bái tiān',117),
        lesson('g2a','l16','16','难忘的泼水节','难忘|nán wàng;火红|huǒ hóng;人民|rén mín;因为|yīn wèi;总理|zǒng lǐ;人们|rén men;四面八方|sì miàn bā fāng;为了|wèi le;人群|rén qún;欢乐|huān lè;开心|kāi xīn',117),
        lesson('g2a','l17','17','刘胡兰','由于|yóu yú;年轻|nián qīng;共产党员|gòng chǎn dǎng yuán;共产党|gòng chǎn dǎng;现在|xiàn zài;一点儿|yī diǎnr;消息|xiāo xi',118)
      ], '蜜蜂|mì fēng;山峰|shān fēng;清晨|qīng chén;勇气|yǒng qì;团结|tuán jié;红旗|hóng qí'),
      unit('g2a', 7, '第七单元 · 阅读', [
        lesson('g2a','l18','18','古诗二首：江雪、敕勒歌','千山|qiān shān;飞鸟|fēi niǎo;小舟|xiǎo zhōu;江雪|jiāng xuě;草原|cǎo yuán;牛羊|niú yáng',0),
        lesson('g2a','l19','19','雾在哪里','于是|yú shì;无论|wú lùn;船只|chuán zhī;同时|tóng shí;行人|xíng rén;一切|yī qiè;上空|shàng kōng;看来|kàn lái;不久|bù jiǔ;路上|lù shàng;出现|chū xiàn;散步|sàn bù;消失|xiāo shī',118),
        lesson('g2a','l20','20','雪孩子','空地|kòng dì;伙伴|huǒ bàn;唱歌|chàng gē;回家|huí jiā;一会儿|yī huìr;着火|zháo huǒ;火星|huǒ xīng;一边|yī biān;连忙|lián máng;树林|shù lín;水汽|shuǐ qì;白云|bái yún',118)
      ], '大雪|dà xuě;冬日|dōng rì;冷风|lěng fēng;棉衣|mián yī;火炉|huǒ lú;温暖|wēn nuǎn'),
      unit('g2a', 8, '第八单元 · 阅读', [
        lesson('g2a','l21','21','称赞','果子|guǒ zi;木工|mù gōng;身边|shēn biān;仔细|zǐ xì;能干|néng gàn;椅子|yǐ zi;怎么|zěn me;自信|zì xìn;从来|cóng lái;这么|zhè me',118),
        lesson('g2a','l22','22','纸船和风筝','上面|shàng miàn;快乐|kuài lè;可是|kě shì;难过|nán guò;但是|dàn shì;和好|hé hǎo',118),
        lesson('g2a','l23','23','快乐的小河','眼泪|yǎn lèi;水花|shuǐ huā;青草|qīng cǎo;游戏|yóu xì;只有|zhǐ yǒu;可爱|kě ài;可以|kě yǐ;多少|duō shao;咱们|zán men;田野|tián yě;大地|dà dì;远方|yuǎn fāng',118)
      ], '友好|yǒu hǎo;分享|fēn xiǎng;感谢|gǎn xiè;合作|hé zuò;开心|kāi xīn;笑容|xiào róng')
    ]
  },
  {
    id: 'g2b', title: '二年级下册', edition: '统编语文 · 人民教育出版社 · 根据2022年版课程标准修订',
    verified: '2026-11-06', sourceUpdated: official.g2b.updated, sourceUrl: bookUrl('g2b'),
    note: '已核对官方现行电子教材的28个课目和240个词语表词。含《我不是最弱小的》《黄帝的传说》《大禹治水》。另含古诗组词、少量补充词与8组园地原创复习；补充词逐词标记。',
    units: [
      unit('g2b', 1, '第一单元 · 阅读', [
        lesson('g2b','l1','1','古诗二首：咏柳、村居','古诗|gǔ shī;村居|cūn jū;儿童|ér tóng;碧玉|bì yù;绿叶|lǜ yè;剪刀|jiǎn dāo',0),
        lesson('g2b','l2','2','找春天','春天|chūn tiān;寻找|xún zhǎo;眉毛|méi mao;野花|yě huā;柳枝|liǔ zhī;桃花|táo huā',120),
        lesson('g2b','l3','3','开满鲜花的小路','鲜花|xiān huā;先生|xiān sheng;原来|yuán lái;大叔|dà shū;太太|tài tai;做客|zuò kè;正巧|zhèng qiǎo;惊奇|jīng qí;快活|kuài huo;美好|měi hǎo;礼物|lǐ wù',120),
        lesson('g2b','l4','4','邓小平爷爷植树','植树|zhí shù;碧空如洗|bì kōng rú xǐ;万里无云|wàn lǐ wú yún;格外|gé wài;引人注目|yǐn rén zhù mù;休息|xiū xi;小心|xiǎo xīn;笔直|bǐ zhí',120)
      ], '春雨|chūn yǔ;公园|gōng yuán;花草|huā cǎo;春风|chūn fēng;嫩芽|nèn yá;泥土|ní tǔ'),
      unit('g2b', 2, '第二单元 · 阅读', [
        lesson('g2b','l5','5','雷锋叔叔，你在哪里','雷锋|léi fēng;叔叔|shū shu;昨天|zuó tiān;温暖|wēn nuǎn;爱心|ài xīn',120,'帮助|bāng zhù'),
        lesson('g2b','l6','6','千人糕','好奇|hào qí;也许|yě xǔ;桌子|zhuō zi;平时|píng shí;难道|nán dào;平常|píng cháng;农民|nóng mín;加工|jiā gōng;农具|nóng jù;甜菜|tián cài;工具|gōng jù;劳动|láo dòng;经过|jīng guò;应该|yīng gāi',120),
        lesson('g2b','l7','7','我不是最弱小的','弱小|ruò xiǎo;周末|zhōu mò;父母|fù mǔ;吸引|xī yǐn;芬芳|fēn fāng;背包|bēi bāo;雨衣|yǔ yī;为什么|wèi shén me;勇敢|yǒng gǎn',120)
      ], '关心|guān xīn;互助|hù zhù;礼貌|lǐ mào;伸手|shēn shǒu;送水|sòng shuǐ;谢谢|xiè xie'),
      unit('g2b', 3, '第三单元 · 识字', [
        lesson('g2b','s1','识字1','神州谣','神州|shén zhōu;中华|zhōng huá;山川|shān chuān;长江|cháng jiāng;长城|cháng chéng;民族|mín zú;情谊|qíng yì',120),
        lesson('g2b','s2','识字2','传统节日','传统|chuán tǒng;节日|jié rì;春节|chūn jié;花灯|huā dēng;清明节|qīng míng jié;先人|xiān rén;龙舟|lóng zhōu;中秋|zhōng qiū;转眼|zhuǎn yǎn;团圆|tuán yuán',120),
        lesson('g2b','s3','识字3','“贝”的故事','故事|gù shi;生活|shēng huó;甲骨文|jiǎ gǔ wén;样子|yàng zi;钱币|qián bì;钱财|qián cái;有关|yǒu guān',121),
        lesson('g2b','s4','识字4','中国美食','美食|měi shí;茄子|qié zi;烤鸭|kǎo yā;水煮鱼|shuǐ zhǔ yú;羊肉|yáng ròu;蛋炒饭|dàn chǎo fàn',121)
      ], '团聚|tuán jù;家乡|jiā xiāng;月饼|yuè bǐng;米饭|mǐ fàn;南方|nán fāng;北方|běi fāng'),
      unit('g2b', 4, '第四单元 · 阅读', [
        lesson('g2b','l8','8','彩色的梦','彩色|cǎi sè;铅笔盒|qiān bǐ hé;森林|sēn lín;雪松|xuě sōng;歌声|gē shēng;苹果|píng guǒ;精灵|jīng líng;季节|jì jié;流动|liú dòng',121),
        lesson('g2b','l9','9','一匹出色的马','出色|chū sè;妹妹|mèi mei;碧绿|bì lǜ;波纹|bō wén;恋恋不舍|liàn liàn bù shě;柳树|liǔ shù;枝条|zhī tiáo;不时|bù shí',121),
        lesson('g2b','l10','10','枫树上的喜鹊','绿色|lǜ sè;一直|yī zhí;说话|shuō huà;童话|tóng huà;阿姨|ā yí;发现|fā xiàn;弟弟|dì di;发明|fā míng;拼音|pīn yīn;字母|zì mǔ;上升|shàng shēng',121)
      ], '想象|xiǎng xiàng;彩笔|cǎi bǐ;书包|shū bāo;童年|tóng nián;歌唱|gē chàng;飞翔|fēi xiáng'),
      unit('g2b', 5, '第五单元 · 阅读', [
        lesson('g2b','l11','11','寓言二则：亡羊补牢、揠苗助长','亡羊补牢|wáng yáng bǔ láo;劝告|quàn gào;禾苗|hé miáo;力气|lì qi;明白|míng bai',121,'后悔|hòu huǐ'),
        lesson('g2b','l12','12','画杨桃','杨桃|yáng táo;图画|tú huà;讲桌|jiǎng zhuō;座位|zuò wèi;教室|jiào shì;老老实实|lǎo lǎo shí shí;时候|shí hou;哈哈大笑|hā hā dà xiào;五角星|wǔ jiǎo xīng;画纸|huà zhǐ;神情|shén qíng',121),
        lesson('g2b','l13','13','小马过河','愿意|yuàn yì;飞快|fēi kuài;为难|wéi nán;伯伯|bó bo;立刻|lì kè;突然|tū rán;吃惊|chī jīng;认真|rèn zhēn;难为情|nán wéi qíng',121)
      ], '思考|sī kǎo;尝试|cháng shì;办法|bàn fǎ;仔细|zǐ xì;发现|fā xiàn;改正|gǎi zhèng'),
      unit('g2b', 6, '第六单元 · 阅读', [
        lesson('g2b','l14','14','古诗二首：绝句、晓出净慈寺送林子方','黄鹂|huáng lí;白鹭|bái lù;青天|qīng tiān;西岭|xī lǐng;荷花|hé huā;莲叶|lián yè',0),
        lesson('g2b','l15','15','雷雨','雷雨|léi yǔ;乌云|wū yún;黑沉沉|hēi chén chén;闪电|shǎn diàn;雷声|léi shēng;窗户|chuāng hu;清新|qīng xīn;迎面|yíng miàn',121),
        lesson('g2b','l16','16','要是你在野外迷了路','野外|yě wài;天然|tiān rán;指南针|zhǐ nán zhēn;帮助|bāng zhù;方向|fāng xiàng;忠实|zhōng shí;向导|xiàng dǎo;指点|zhǐ diǎn;北极星|běi jí xīng;永远|yǒng yuǎn;黑夜|hēi yè;帮忙|bāng máng;特别|tè bié;积雪|jī xuě',121),
        lesson('g2b','l17','17','太空生活趣事多','航天员|háng tiān yuán;宇宙飞船|yǔ zhòu fēi chuán;空间站|kōng jiān zhàn;活动|huó dòng;主要|zhǔ yào;方便|fāng biàn;直接|zhí jiē;浴桶|yù tǒng;清理|qīng lǐ;实在|shí zài;通常|tōng cháng',122)
      ], '北斗|běi dǒu;南北|nán běi;宇航|yǔ háng;星空|xīng kōng;地图|dì tú;安全|ān quán'),
      unit('g2b', 7, '第七单元 · 阅读', [
        lesson('g2b','l18','18','大象的耳朵','大象|dà xiàng;耳朵|ěr duo;扇子|shàn zi;似的|shì de;慢慢|màn màn;遇到|yù dào;一定|yī dìng;每天|měi tiān;睡觉|shuì jiào;经常|jīng cháng;人家|rén jia',122),
        lesson('g2b','l19','19','蜘蛛开店','决定|jué dìng;商店|shāng diàn;河马|hé mǎ;工夫|gōng fu;终于|zhōng yú;星期|xīng qī',122),
        lesson('g2b','l20','20','青蛙卖泥塘','青蛙|qīng wā;野鸭|yě yā;泉水|quán shuǐ;花丛|huā cóng;尽情|jìn qíng;游泳|yóu yǒng',122),
        lesson('g2b','l21','21','小毛虫','新奇|xīn qí;目光|mù guāng;到处|dào chù;仿佛|fǎng fú;周游|zhōu yóu;任何|rèn hé;事情|shì qing;纺织|fǎng zhī;怎样|zěn yàng;以前|yǐ qián;灵巧|líng qiǎo;色彩|sè cǎi;花纹|huā wén',122)
      ], '耐心|nài xīn;努力|nǔ lì;变化|biàn huà;长大|zhǎng dà;本领|běn lǐng;进步|jìn bù'),
      unit('g2b', 8, '第八单元 · 阅读', [
        lesson('g2b','l22','22','羿射九日','开始|kāi shǐ;光明|guāng míng;值日|zhí rì;决心|jué xīn;最后|zuì hòu;从此|cóng cǐ;欢唱|huān chàng;生机|shēng jī',122),
        lesson('g2b','l23','23','黄帝的传说','传说|chuán shuō;首领|shǒu lǐng;步行|bù xíng;忽然|hū rán;启发|qǐ fā;搬运|bān yùn;号召|hào zhào;民众|mín zhòng;自由|zì yóu;道理|dào lǐ;根本|gēn běn;果然|guǒ rán;提供|tí gōng;便利|biàn lì',122),
        lesson('g2b','l24','24','大禹治水','洪水|hóng shuǐ;痛苦|tòng kǔ;百姓|bǎi xìng;必须|bì xū;反而|fǎn ér;仍然|réng rán;治服|zhì fú;继续|jì xù;采用|cǎi yòng;奔波|bēn bō;带领|dài lǐng;农业|nóng yè;安居乐业|ān jū lè yè',122)
      ], '古代|gǔ dài;故事|gù shi;山河|shān hé;愿望|yuàn wàng;智慧|zhì huì;和平|hé píng')
    ]
  }
];

// 第16课词语表跨两页；保留每个词的准确核验页。
const acrossPages = curriculum[1].units[5].lessons.find(item => item.id === 'g2b-l16');
acrossPages.note = '教材词语表已核对官方电子教材第121—122页。拼音由本应用标注。';
acrossPages.sourcePages = [121, 122];
acrossPages.words.forEach((word, i) => { word.sourceUrl = pageUrl('g2b', i < 7 ? 121 : 122); });

export const curriculumStats = curriculum.map(book => ({
  id: book.id,
  units: book.units.length,
  lessons: book.units.reduce((sum, item) => sum + item.lessons.filter(l => l.number !== '园地').length, 0),
  textbookWords: book.units.flatMap(item => item.lessons).flatMap(item => item.words).filter(word => word.source === 'textbook').length,
  supplementWords: book.units.flatMap(item => item.lessons).flatMap(item => item.words).filter(word => word.source === 'supplement').length,
  words: book.units.flatMap(item => item.lessons).flatMap(item => item.words).length
}));
