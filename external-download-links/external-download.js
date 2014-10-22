/*
 * Add download options, this action is just an example
 * Use it to add your external websites
 *
 * By André Zanghelini (An_dz) under Public Domain
 */

/**
 * @version 1.1
 */

// Action trigger: document modified

xtt.ui.add.downloadMenuItem({
    text: "First Option",
    tooltip: "This is the first option",
    uri: "http://www.github.com/#" + xtt.video.getVideoURI(true),
    clickListener: function (event) {
        event.preventDefault()
        window.open(this.href)
    }
})

xtt.ui.add.downloadMenuItem({
    text: "Last Option",
    tooltip: "This is the last option",
    uri: "http://www.github.com/#" + xtt.video.getVideoURI(true),
    clickListener: function (event) {
    	event.preventDefault()
    	window.open(this.href)
    }
})
