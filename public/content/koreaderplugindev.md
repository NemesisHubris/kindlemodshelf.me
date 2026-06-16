# DEVELOPING YOUR FIRST PLUGIN FOR KOREADER

> Want a custom KOReader feature? This guide shows how to build a simple plugin in Lua.

## Overview

In this guide, we'll go over what you need to set up to make your plugin, and write a basic "Hello World" plugin. For in-depth reference on KOReader's Lua components and examples of more complicated plugins, please look at the [source code over at their github repo](https://github.com/koreader/koreader). We will briefly go over some basics of Lua here, but this is not a Lua tutorial. Please refer to the [Lua documentation](https://www.lua.org/manual/5.3/) if you want to know more.

## Setting Up

Programming without in-editor hints and context-aware autocomplete isn't the best experience, so let's start by setting up our environment. First, let's get the KOReader source code and set up your LSP to properly recognize the require calls.

### Create the plugin Git repo

First, make a directory for your plugin. By convention, that's a directory with the plugin's name and `.koplugin` at the end of it, for example: `HelloWorld.koplugin`

    mkdir HelloWorld.koplugin
    cd HelloWorld.koplugin
    git init -b main

### Add the KOReader repository as a submodule

    git submodule add https://github.com/koreader/koreader.git

### Create the .luarc.json file

This file will tell your editor the necessary information about your project. For our purposes, we use it to point the LSP to the KOReader Lua source code directories, and to tell it to not scan some directories it doesn't need to:

    {
      "workspace": {
        "library": ["./koreader/frontend"],
        "ignoreDir": [".vscode", ".git"]
      }
    }

At this point, environment is set up, let's move on to making the actual plugin.

## Making the Plugin

Every KOReader plugin consists of at least two files:

  - `main.lua` that is the entrypoint to your plugin;
  - `_meta.lua` that describes your plugin to KOReader's plugin manager.

### _meta.lua

This file's structure is extremely simple, it just contains the name and the description of the plugin:

    local _ = require("gettext")
    return {
        name = "hello_world",
        fullname = _("Hello World"),
        description = _([[This is a Hello World plugin.]]),
    }

### main.lua

This is your plugin's main entrypoint file. It gets executed when the plugin is loaded, and in simple cases will contain all of the code. In more complex cases, it's recommended to split it into files and require them as needed.

This code is taken from KOReader's own hello.koplugin, since it's a great example, and modified slightly.

    --[[--
    This is a debug plugin to test Plugin functionality.

    @module koplugin.HelloWorld
    --]]--

    local Dispatcher = require("dispatcher")  -- luacheck:ignore
    local InfoMessage = require("ui/widget/infomessage")
    local UIManager = require("ui/uimanager")
    local WidgetContainer = require("ui/widget/container/widgetcontainer")
    local _ = require("gettext")

    local Hello = WidgetContainer:extend{
        name = "hello_world",
        is_doc_only = false,
    }

    function Hello:onDispatcherRegisterActions()
        Dispatcher:registerAction("helloworld_action", {category="none", event="HelloWorld", title=_("Hello World"), general=true,})
    end

    function Hello:init()
        self:onDispatcherRegisterActions()
        self.ui.menu:registerToMainMenu(self)
    end

    function Hello:addToMainMenu(menu_items)
        menu_items.hello_world = {
            text = _("Hello World"),
            -- in which menu this should be appended
            sorting_hint = "more_tools",
            -- a callback when tapping
            callback = function()
                Hello.onHelloWorld(self)
            end,
        }
    end

    function Hello:onHelloWorld()
        local popup = InfoMessage:new{
            text = _("Hello World"),
        }
        UIManager:show(popup)
    end

    return Hello

## Code Breakdown

Let's go over the code bit by bit:

### LuaDoc Comment

    --[[--
    This is a debug plugin to test Plugin functionality.

    @module koplugin.HelloWorld
    --]]--

The LuaDoc comment is partly for human readers, and partly for your IDE: the `@module koplugin.HelloWorld` is a LuaDoc tag indicating the module name for the documentation.

### Module Imports

    local Dispatcher = require("dispatcher")  -- luacheck:ignore
    local InfoMessage = require("ui/widget/infomessage")
    local UIManager = require("ui/uimanager")
    local WidgetContainer = require("ui/widget/container/widgetcontainer")
    local _ = require("gettext")

This is the module imports section.

  - `Dispatcher` is the module responsible for dispatching events. We'll hook into it to register our actions. You can also use it to trigger actions within KOReader, like switching a page, changing the font, etc.
  - `InfoMessage` is the widget we'll display when the user clicks on our menu entry
  - `UIManager` is, as the name suggests, the module that manages widgets. You can use it to show and hide widgets, trigger repaints, and do other things related to the UI.
  - `WidgetContainer` is the base widget for your plugin. It can contain other widgets, and is responsible for event propagation and painting (with different alignments) for its children.
  - `_` is the Lua implementation of a subset of gettext. It's used for translation of your plugin's text strings to different languages and for formatting. Excerpt from gettext's manpage: "The gettext program translates a natural language message into the user's language, by looking up the translation in a message catalog."

### Widget Initialization

    local Hello = WidgetContainer:extend{
        name = "hello_world",
        is_doc_only = false,
    }

Here we initialize our base widget and give it a name. It should match the name in `_meta.lua`. `is_doc_only = false` tells the KOReader plugin loader to register the plugin instance and keep track of it. If it's set to true, the plugin will not be shown in the plugins list, and its constructor won't be called upon load, or receive events.

### Dispatcher Registration

    function Hello:onDispatcherRegisterActions()
        Dispatcher:registerAction("helloworld_action", {category="none", event="HelloWorld", title=_("Hello World"), general=true,})
    end

Here we define a method in Hello that we'll call later to register our action in the Dispatcher. Every widget extends EventListener, and when Dispatcher sends an event, `on{EventName}` is called on each widget the event is propagated to. In our case, that will be `Hello:onHelloWorld`

### Initialization Method

    function Hello:init()
        self:onDispatcherRegisterActions()
        self.ui.menu:registerToMainMenu(self)
    end

Here we call the method we made earlier, and also call `registerToMainMenu(self)`. That will, in turn, call the method we'll define next:

### Main Menu Registration

    function Hello:addToMainMenu(menu_items)
        menu_items.hello_world = {
            text = _("Hello World"),
            -- in which menu this should be appended
            sorting_hint = "more_tools",
            -- a callback when tapping
            callback = function()
                Hello.onHelloWorld(self)
            end,
        }
    end

Here we create a menu entry. All the strings that can be shown to a user here are wrapped with gettext so that they can be translated.

  - `text` is the name of the entry that'll be displayed to the user in the menu
  - `sorting_hint` tells KOReader in which menu or submenu to place this entry. Possible values are (non-exhaustive! Each plugin can add their own menu or submenu):
    - navi
    - typeset
    - setting
    - tools
    - more_tools
    - search
    - filemanager
    - main
    - screen
    - document
    - device
    - selection_text
  - `callback` is the function that gets called. In this case it just directly calls our `onHelloWorld` event handler, bypassing the Dispatcher.

### Event Handler

    function Hello:onHelloWorld()
        local popup = InfoMessage:new({
            text = _("Hello World"),
        })
        UIManager:show(popup)
    end

This is the method that's called when either the user presses the Hello World button we've created, or some other plugin sends the HelloWorld event through the Dispatcher.

`local popup = InfoMessage:new({text = _("Hello World")})` — Here we create an instance of the InfoMessage widget. It's similar in spirit to alert in JavaScript, it's a modal window that closes when you click outside of it. It can also be moved around by the user, have custom height, an icon and you can set a timeout, after which it'll close automatically.

`UIManager:show(popup)` — Here we take the popup instance we've made, and tell UIManager to show it, which it'll do in its own event loop

### Module Return

    return Hello

Finally, we return the Hello class so that KOReader can instantiate and use it.

## Credits

The original guide was created by [consoleaf](https://gist.github.com/consoleaf) and can be found [here](https://gist.github.com/consoleaf/abbe8449377f1f6ef47b86d6c0d8873d).
