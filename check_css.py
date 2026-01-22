
def check_css(file_path):
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    balance = 0
    for i, line in enumerate(lines):
        for char in line:
            if char == '{':
                balance += 1
            elif char == '}':
                balance -= 1
        
        if balance < 0:
            print(f"Error: Unexpected closing brace at line {i+1}")
            print(line.strip())
            return

    if balance != 0:
        print(f"Error: Unbalanced braces. Final balance: {balance} (Positive means missing '}}')")
    else:
        print("Braces are balanced.")

check_css('public/style.css')
