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
 * This action will try yo keep you out of HTML5 trial.
 *
 * @version 1.1
 */

// Action trigger: immediately

/*! settings begin */
var // defines how log cookie should live
	// 864e5 * 365	1 year
	// 864e5 * 182	6 months
	// 864e5 * 30	1 month
	// 6048e5		1 week
	// 864e5		1 day
	// 864e5/2		12 hours
	// 36e5			1 hour
	cookieLife = 864e5 * 15,
/*! settings end */

	prefCookie = getCookie("PREF")

if (prefCookie && /f2=40000000/.test(prefCookie)) {
	document.cookie = "PREF="
					+ prefCookie.replace(/f2=40000000/, "")
					+ "; path=/; domain=youtube.com; expires="
					+ (new Date(Date.now() + cookieLife)).toUTCString()

	window.location.replace(window.location.href)
}

function getCookie(name) {
	var cookie = null
	document.cookie.split("; ").some(function (pair) {
		if (pair.substring(0, pair.indexOf("=")) == name) {
			cookie = pair.substring(1 + pair.indexOf("="))
			return true
		}
	})
	return cookie
}
