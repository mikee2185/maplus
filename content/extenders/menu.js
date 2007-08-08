﻿/* ***** BEGIN LICENSE BLOCK *****
 *   Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 * 
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Melior Annis Plus.
 *
 * The Initial Developer of the Original Code is
 * Michal Dvorak.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 * 
 * ***** END LICENSE BLOCK ***** */

// Rozsirene menu
pageExtenders.add(PageExtender.create({
    getName: function() { return "Menu - Vypis Utoku 2"; },

    analyze: function(page, context) {
        context.utoky = $X('font/a[contains(., "Výpisy") and contains(., "útoků")]', page.rightMenu); // pozn: netusim jak ho donutit brat mezeru
        
        return (context.utoky != null);
    },
    
    process: function(page, context) {
        // Pridani primeho linku na detail utoku
        var link = context.utoky;
        
        var br = document.createElement("br");
        var detail = document.createElement("a");
        detail.href = link.href + "_detailne";
        detail.innerHTML = "Výpisy útoků 2";
        
        link.parentNode.insertBefore(detail, link.nextSibling);
        link.parentNode.insertBefore(br, detail);
    }    
}));

// Linky na aliance
pageExtenders.add(PageExtender.create({
    getName: function() { return "Menu - Aliance"; },

    analyze: function(page, context) {
        context.alianceLink = $X('font/a[. = "Aliance"]', page.rightMenu); 
        return (context.alianceLink != null);
    },
    
    process: function(page, context) {
        // Nacteni ulozenych alianci (musi byt v process protoze behem analyzy se teprv zjistuji id alianci)
        var seznam = page.config.getAliance().getPrefNodeList("id");
        if (!seznam)
            return false;
            
        context.aliance = new Array();
        $A(seznam).each(function(i) {
                var id = i.getNumber();
                if (id && !isNaN(id))
                    context.aliance.push(id);
            });
        
        if (context.aliance.length == 0)
            return false;
    
        // Prejmenovani puvodniho linku
        context.alianceLink.innerHTML = "Ali";
    
        // Vytvoreni elementu
        var elems = new Array();
        
        for (var i = 0; i < context.aliance.length; i++) {
            var id = context.aliance[i];
            var text = String.format("V{0}", i + 1);
            elems.push(this._createLink(page, "vypsat", id, text));
        }
        
        for (var i = 0; i < context.aliance.length; i++) {
            var id = context.aliance[i];
            var text = String.format("N{0}", i + 1);
            elems.push(this._createLink(page, "nastavit", id, text));
        }
        
        // Vlozeni elementu
        var parent = context.alianceLink.parentNode;
        var insertionPoint = context.alianceLink.nextSibling;
        
        elems.each(function(e) {
                parent.insertBefore(document.createTextNode(" "), insertionPoint);
                parent.insertBefore(e, insertionPoint);
            });
    },
    
    _createLink: function(page, akce, id, text) {
        var e = document.createElement("a");
        e.href = MaPlus.buildUrl(page, "aliance.html", {aliance: akce + "_" + id});
        e.innerHTML = text;        
        return e;
    }
}));

// Kalkulacka
pageExtenders.add(PageExtender.create({
    getName: function() { return "Menu - Kalkulacka"; },

    analyze: function(page, context) {
        context.kalkulackaHtml = Chrome.loadText("html/kalkulacka.html");
        return (context.kalkulackaHtml != null);
    },
    
    process: function(page, context) {
        var div = document.createElement("div");
        div.innerHTML = context.kalkulackaHtml;
        page.leftMenu.appendChild(div);

        var cfg = page.localConfig;
        // Definovano v html
        Kalkulacka.init(cfg.getPref("kalkulacka", ""), 
            function(e)
            {
                cfg.setPref("kalkulacka", e.target.value);
            });
    }
}));

// Poznamky
pageExtenders.add(PageExtender.create({
    getName: function() { return "Menu - Poznamky"; },

    analyze: function(page, context) {
        context.poznamkyHtml = Chrome.loadText("html/poznamky.html");
        return (context.poznamkyHtml != null);
    },
    
    process: function(page, context) {
        var div = document.createElement("div");
        div.innerHTML = context.poznamkyHtml;
        page.leftMenu.appendChild(div);

        var cfg = page.config;
        // Definovano v html
        Poznamky.init(cfg.getPref("poznamky", ""), 
            function(e)
            {
                cfg.setPref("poznamky", e.target.value);
            });
    }
}));
