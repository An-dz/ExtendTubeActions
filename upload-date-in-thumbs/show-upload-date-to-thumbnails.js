/*
 * Copyright (C) 2012 2013 Darko Pantić <pdarko@myopera.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This action will add upload date to video thumbnails.
 *
 * @version 1.2
 */

// Action trigger: DOM created

var videolist = [],
	partition = [],
	thumbnails = document.querySelectorAll("a[href^=\"/watch?\"]"),
	ytns = "http://gdata.youtube.com/schemas/2007"

Array.prototype.forEach.call(thumbnails, function (anchor) {
	var id = anchor.href.match(/v=([^&]+)/)
	if (id && id[1])
		videolist.push(id[1])
})

if (!videolist.length)
	return

videolist = videolist.filter(function (element, position) {
	return videolist.indexOf(element) == position
})

while (videolist.length)
	partition.push(videolist.splice(0, 50))

partition.forEach(function (list) {
	var postdata = "\
<feed xmlns=\"http://www.w3.org/2005/Atom\"\n\
	xmlns:batch=\"http://schemas.google.com/gdata/batch\">\n\
	<batch:operation type=\"query\"/>\n" + list.reduce(function (entry, id) { return entry += "\
	<entry>\n\
		<id>http://gdata.youtube.com/feeds/api/videos/" + id + "</id>\n\
	</entry>\n" }, "") + "\
</feed>",
		xhr = new window.XMLHttpRequest()

	xhr.open("post",
			 "http://gdata.youtube.com/feeds/api/videos/batch?fields="
				 + "entry(published,media:group/yt:videoid)",
			 false)
	xhr.setRequestHeader("Content-Type", "application/atom+xml; charset=utf-8")
	xhr.setRequestHeader("Content-Length", postdata.length)
	xhr.setRequestHeader("GData-Version", 2)

	xhr.onreadystatechange = function () {
		if (xhr.readyState != 4)
			return

		var entries = xhr.responseXML.getElementsByTagName("entry")
		Array.prototype.forEach.call(entries, function (entry) {
			var id = entry.getElementsByTagNameNS(ytns, "videoid"),
				published = entry.getElementsByTagName("published"),
				thumb, uname, date, month, year

			if (!id[0] || !published[0])
				return

			uname = document.querySelector("a[href*=\"v=" + id[0].textContent + "\"] .yt-user-name")
			if (!uname)
				return

			published = new Date(published[0].textContent)
			date = published.getDate()
			month = 1 + published.getMonth()
			month = month < 10 ? "0" + month : month
			year = published.getFullYear()

			uname.parentNode.style.setProperty("height", "auto")
			uname.insertAdjacentHTML("afterend", "<br>on " + date + "." + month + "." + year)
		})
	}

	xhr.send(postdata)
})
