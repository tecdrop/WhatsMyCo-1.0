@echo off
java -jar "c:\Programs\Develop\Web\Closure Compiler\compiler.jar" ^
--compilation_level ADVANCED_OPTIMIZATIONS ^
--js "d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\js\whatsmyco.appstrings.js" ^
--js "d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\js\whatsmyco.tools.js" ^
--js "d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\js\whatsmyco.uiupdater.js" ^
--js "d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\js\whatsmyco.colordownloader.js" ^
--js "d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\js\whatsmyco.filecolorcalculator.js" ^
--js "d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\js\whatsmyco.app.js" ^
--externs "d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\make\externs\externs.jquery.js" ^
--externs "d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\make\externs\externs.modernizr.js" ^
--externs "d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\make\externs\externs.pusher.color.js" ^
--externs "d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\make\externs\externs.bufcrc32.js" ^
--warning_level VERBOSE ^
--js_output_file="d:\HDevelop\Aurelify\WhatsMyCo\Web\Source\Next\Brackets\make\app.js"

pause