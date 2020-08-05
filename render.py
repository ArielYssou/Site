import os

from sys import argv
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup
from pygments import highlight
from pygments.lexers import guess_lexer, get_lexer_by_name
from pygments.formatters import HtmlFormatter
from pygments.filters import VisibleWhitespaceFilter

try:
    target_file = argv[1]
    basedir = os.path.dirname(target_file) 
except IndexError:
    raise ValueError('No target file informed')

#html_formatter = HtmlFormatter(linenos = 'table')
html_formatter = HtmlFormatter()

# this tells jinja2 to look for templates
# in the templates subdirectory
env = Environment(
    loader = FileSystemLoader(basedir),
)

input_file = 'index.html'
output_file = f'{basedir}/parsed_index.html'

# reading the template
template = env.get_template(input_file)
# render the template
# in other words, we replace the template tag
# by the contents of the overfitting file
rendered = template.render()

# replace the pre tags by highlighted code
soup = BeautifulSoup(rendered, 'html.parser')
for pre in soup.find_all('pre'):
    # escaping already formatted pres
    if pre.parent.name == 'div': 
        pclass = pre.parent.get('class')
        if pclass and \
           ('highlight' in pclass or \
           'hilighttable' in pclass or \
            'output_text' in pclass):
            continue
    # highlighting with pygments
    if ('createCanvas' in pre.string) or ('this.' in pre.string):
        lexer = get_lexer_by_name('js')
    elif ('self.' in pre.string):
        lexer = get_lexer_by_name('py')
    else:
        lexer = guess_lexer(pre.string)
    lexer.add_filter(VisibleWhitespaceFilter(tabsize=2))

    code = highlight(pre.string.rstrip(),
                     lexer,
                     html_formatter)

    new_tag = pre.replace_with(code)
    
# create the final html string.
# formatter None is used to preserve
# the html < and > signs 
rendered = soup.prettify(formatter=None)

with open(output_file, 'w') as ofile:
    ofile.write(rendered)

