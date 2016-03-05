gmail-strike-through-insert-img
===================

这个的原版在[这里](http://userscripts-mirror.org/scripts/review/57725),但是userscript.org总是挂掉，所以在这里备份一下。作者上次更新是2013年，现在好像用不了了，我把他改成了click的时候就运行，原版里的DOMNodeInserted event不知为什么没有效果，另外加了个直接把链接换成<img>图片的按钮,还有增加了多个窗口中都能使用的功能，原版假设页面上只有一个编辑窗口

强迫症效果
------------------
https://gfycat.com/OfficialYearlyAngelfish
![gif](http://i.imgur.com/mhYY1xM.gif)

To Do
------------------

* 由于lz把DOMNodeInserted换成了click,所以页面初始显示时没有新增的按钮,必须任意地方点一下才有,这有点奇怪,为何DOMNodeInserted event会没有效果呢?
* 插入图片以后,自动按下"best fit"按钮
* 在插入图片的按钮上弹出次级菜单,有100%,50%,best fit等选项
