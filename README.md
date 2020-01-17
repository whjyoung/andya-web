
	2019/11/13
问题一：上研 web-andya 关于Echarts适配窗口变化的问题——前端总结
		1.CSS 调整Echarts插件的宽高，按照 ‘%’ 比例设置。
		2.JS文件 在mounted或者option下添加以下代码：
			window.addEventListener('resize', function() {
				console.log(echarts);
				echarts.init(document.getElementById('插件Id')).resize();
			});
				
问题二：上研web-andya 关于检测版本更新
	方案一：
		在根目录下的index.html文件头部添加
			<METAHTTP-EQUIV="Pragma"CONTENT="no-cache">
			<METAHTTP-EQUIV="Cache-Control"CONTENT="no-cache">
			<METAHTTP-EQUIV="Expires"CONTENT="0">
	方案二：
		使用websocket监听后端接口，有反馈数据实时自动刷新页面。
	方案三：
		手动清理浏览器缓存(不推荐)。		
		
问题三：上研web-andya 关于websocket心跳活性
	1.写好的 心跳初始化 要紧跟 websocket初始化。
		拿到需要的 websocket.readyState 状态码来确定是否具备条件开启心跳。
	2.websocket建立了握手协议之后，同一时间只能进行一个单向操作: get或send (多线程可以操作，但是不推荐)。
		因而当有最新数据get进来时，心跳自动退出线程，可以在数据处理完之后再reset重启心跳。(心跳是send)
	3.心跳有时会有2-4秒延迟，最好把时间设置的短一些。