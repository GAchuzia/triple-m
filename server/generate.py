import argparse
import random
import textwrap
import requests
import json
import sys

def main():
    parser = argparse.ArgumentParser(formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent('''\
        NOTE: Leave arguments to end

        Commands:
        '''))
    parser.add_argument("-o", "--operation", help="addition, subtraction, multiplication, division", type=str, required=True)
    parser.add_argument("-q", "--quantity", help="quantity of questions generated", type=int, required=True)
    parser.add_argument("-f", "--fields", help="number of fields in the question", type=int, required=True)
    parser.add_argument("-max", "--maximum", help="number range max", type=int, required=True)
    parser.add_argument("-min", "--minimum", help="number range min", type=int, required=True)
    args = parser.parse_args()

    # Validate operation chosen
    if (args.operation == "addition" or args.operation == "subtraction" or args.operation == "multiplication" or args.operation == "division"):
        print("Running", file=sys.stderr, end="")
        for i in range(args.quantity):
            create_case(args.operation, args.fields, args.maximum, args.minimum)
        print("\nDone", file=sys.stderr)
    else:
        print("ERROR, Operation not valid", file=sys.stderr)
        exit()
    
# Generate the individual cases
def create_case(operation:str, fields:int, max:int, min:int):
    content = {}
    answer = 0
    
    # Calculate the content and answer
    if (operation == "addition"):
        for i in range(fields):
            content[i] = random.randint(min,max)
            answer = content[i] if (i == 0) else answer + content[i]

    elif(operation == "subtraction"):
        for i in range(fields):
            content[i] = random.randint(min,max)
            answer = content[i] if (i == 0) else answer - content[i]

    elif(operation == "multiplication"):
        for i in range(fields):
            content[i] = random.randint(min,max)
            answer = content[i] if (i == 0) else answer * content[i]

    else:
        values = []
        for i in range(fields):
            val = 0
            while(val == 0):
                val = random.randint(min,max)
            values.append(val)
            first_val = values[i] if (i == 0) else first_val * values[i]

        content['0'] = first_val
        for i in range(fields - 1):
            content[i+1] = values[i]
        answer = values[fields - 1]
            
    # Post to backend
    query = {"type": operation, "content": json.dumps(content, indent=4), "answer": str(answer), "attempts": "0", "correct": "0", "rating": "0"}
    response = requests.post('http://localhost:3001/api/insert/', json=query, timeout=1)
    print(".", file=sys.stderr, end="")


if __name__ == "__main__":
    main()


