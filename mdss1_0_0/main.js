const {app, BrowserWindow, Menu }  = require('electron')



let win

function createWindow() {
	win = new BrowserWindow({
		width: 800, 
		height: 720,
		webPreferences: {
			nodeIntegration: true
		}
	})
	
}

function loadConceptsWindow(){
	
	win.loadFile('index.html')
	win.webContents.openDevTools()
}


function loadProcessesWindow() {

	win.loadFile('processes.html')
	win.webContents.openDevTools()

}


app.whenReady().then(function(){
	createWindow()
	loadConceptsWindow()

	const template = [
		{
			label: "File",
			submenu: [
				{
					label: "Refresh"
				},
				{
					label: "Quit",
					role: "quit",
					// click: function(){app.quit()},
					// accelerator: {

					// }
				}
			]
		},
		{
			label: "Process",
			click() {
				loadProcessesWindow()
			}
		},
		{
			label: "Concepts",
			click() {
				loadConceptsWindow()
			}
		}
		
	]
	
	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)



})


app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
})
