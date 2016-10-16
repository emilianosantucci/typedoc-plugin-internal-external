var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "typedoc/lib/converter/components", "typedoc/lib/converter/converter", "typedoc/lib/converter/factories/comment", "typedoc/lib/utils/options"], factory);
    }
})(function (require, exports) {
    "use strict";
    var components_1 = require("typedoc/lib/converter/components");
    var converter_1 = require("typedoc/lib/converter/converter");
    var comment_1 = require("typedoc/lib/converter/factories/comment");
    var options_1 = require("typedoc/lib/utils/options");
    /**
     * This plugin allows you to specify if a symbol is internal or external.
     *
     * Add @internal or @external to the docs for a symbol.
     *
     * @example
     * ```
     *
     * &#47;**
     *  * @internal
     *  *&#47;
     * let foo = "123
     *
     * &#47;**
     *  * @external
     *  *&#47;
     * let bar = "123
     * ```
     */
    var InternalExternalPlugin = (function (_super) {
        __extends(InternalExternalPlugin, _super);
        function InternalExternalPlugin() {
            _super.apply(this, arguments);
        }
        InternalExternalPlugin.prototype.initialize = function () {
            var options = this.application.options;
            options.read({}, options_1.OptionsReadMode.Prefetch);
            var externals = (options.getValue('external-aliases') || "external").split(",");
            var internals = (options.getValue('internal-aliases') || "internal").split(",");
            this.externalRegex = new RegExp("@(" + externals.join('|') + ")\\b");
            this.internalRegex = new RegExp("@(" + internals.join('|') + ")\\b");
            this.listenTo(this.owner, (_a = {},
                _a[converter_1.Converter.EVENT_CREATE_DECLARATION] = this.onDeclaration,
                _a
            ));
            var _a;
        };
        /**
         * Triggered when the converter has created a declaration reflection.
         *
         * @param context  The context object describing the current state the converter is in.
         * @param reflection  The reflection that is currently processed.
         * @param node  The node that is currently processed if available.
         */
        InternalExternalPlugin.prototype.onDeclaration = function (context, reflection, node) {
            if (!node)
                return;
            // Look for @internal or @external
            var comment = comment_1.getRawComment(node);
            var internalMatch = this.internalRegex.exec(comment);
            var externalMatch = this.externalRegex.exec(comment);
            if (internalMatch) {
                reflection.flags.isExternal = false;
            }
            else if (externalMatch) {
                reflection.flags.isExternal = true;
            }
        };
        InternalExternalPlugin = __decorate([
            components_1.Component({ name: 'internal-external' })
        ], InternalExternalPlugin);
        return InternalExternalPlugin;
    }(components_1.ConverterComponent));
    exports.InternalExternalPlugin = InternalExternalPlugin;
});
