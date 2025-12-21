+++
title = "代码示例"
date = 2017-09-24

# [taxonomies]
# categories = ["demo"]
# tags = ["code", "example"]
+++

展示带有 **复制到剪贴板功能** 和 **花哨语言标签** 的代码片段。不再有无聊的代码块。点击本文查看代码示例的效果。

<!-- more -->

```rust
fn main() {
    println!("Hello World");
}
```

相同的代码片段，带行号：

```rust,linenos
fn main() {
    println!("Hello World");
}
```

相同的代码片段，带行号并高亮特定行：

```rust,hl_lines=2,linenos
fn main() {
    println!("Hello World");
}
```

Python 示例：

```python
def main():
    print("你好, 世界!")
```

这是另一个带语法高亮的代码块。很酷，对吧？你也可以在行内使用代码，例如：`var example = true`。

```js
function debounce(func, wait) {
  var timeout;

  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);

    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}
```

C++ 示例：

```cpp
#include <iostream>
using namespace std;
int main() {
    cout << "你好, 世界!" << endl;
    return 0;
}
```
