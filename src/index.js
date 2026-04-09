'use strict';

const path = require("path")
const fs = require("fs");
const md = require("markdown-it")();

// pタグ
// 上下のmarginを詰める
md.renderer.rules.paragraph_open = (tokens, idx, options, env, self) => {
    tokens[idx].attrPush(["style", "margin-top: 2px; margin-bottom: 5px;"]);
    return self.renderToken(tokens, idx, options);
};

// hrタグ
// hrタグと、hyphen-hrクラスを付加したdivにハイフンをテキストをいれた要素に置換
md.renderer.rules.hr = (tokens, idx, options, env, self) => {
  return `<hr>\n<div class="hyphen-hr">----------------------------------------------</div>\n`;
};

// h2タグ
// 要素に下線をつけ、ォントサイズを25pxにし、下部のmarginを5pxにする
// self-paddingクラスを付加したbrタグ2つをh2タグの前に付加する
md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
  if (tokens[idx].tag === "h2") {
    tokens[idx].attrPush(["style", "border-bottom: 3px solid #bfd1e1; margin-bottom: 5px; font-size: 25px;"]);
  }
  
  return `<br class="self-padding">\n<br class="self-padding">\n`+self.renderToken(tokens, idx, options);
};

//styleタグにhyphen-hrクラスとself-paddingクラスをdisplayしないようにする
//jmsだとstyleタグが消えるので描画されるが、普通の環境だと消える
md.core.ruler.push('inject_fixed_style', (state) => {
  const token = new state.Token('html_block', '', 0);
  token.content = `<style>.hyphen-hr { display: none; } .self-padding{ display: none; }</style>\n`;
  
  state.tokens.push(token);
});


//リストタグを「・」や数字付き箇条書きに処理する
//上下のmarginを詰める
md.renderer.rules.bullet_list_open = (tokens, idx, options, env, self) => {
  env.list_stack = env.list_stack || [];
  env.list_stack.push({ type: "ul" });
  return `<div class="custom-ul-wrapper">\n`;
};

md.renderer.rules.bullet_list_close = (tokens, idx, options, env, self) => {
  env.list_stack.pop();
  return "</div>\n";
};

md.renderer.rules.ordered_list_open = (tokens, idx, options, env, self) => {
  env.list_stack = env.list_stack || [];
  const start = tokens[idx].attrGet("start");
  const count = start ? parseInt(start, 10) : 1;
  env.list_stack.push({ type: "ol", count: count });
  return `<div class="custom-ol-wrapper">\n`;
};

md.renderer.rules.ordered_list_close = (tokens, idx, options, env, self) => {
  env.list_stack.pop();
  return "</div>\n";
};

md.renderer.rules.list_item_open = (tokens, idx, options, env, self) => {
  const current_list = env.list_stack[env.list_stack.length - 1];

  tokens[idx].tag = "p";

  tokens[idx].attrPush(["class", "list-item"]);
  tokens[idx].attrPush(["style", "margin-top: 2px; margin-bottom: 5px;"]);

  let prefix = "";
  if (current_list.type === "ul") prefix = "・";
  else if (current_list.type === "ol") prefix = `${current_list.count++}. `;

  return self.renderToken(tokens, idx, options) + prefix;
};

md.renderer.rules.list_item_close = (tokens, idx, options, env, self) => {
  tokens[idx].tag = "p";
  return self.renderToken(tokens, idx, options);
};


async function main(input_path, output_path) {
    try {
        const markdown = fs.readFileSync(input_path, 'utf-8')
        const html = md.render(markdown);
        fs.writeFileSync(output_path, html);
    } catch (e) {
        console.error("Error!", e);
    } 
}

const args = process.argv.slice(2)
const markdown_file_path = args[0]? path.resolve(__dirname, args[0]) : "../introduction.md"
const output_file_path = args[1]? path.resolve(__dirname, args[1]) : "../jms.html"

main(markdown_file_path, output_file_path);
