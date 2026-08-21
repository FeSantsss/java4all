import { executeJavaSubset } from '@/components/study/javaSubsetRunner';

describe('offline Java Lab subset', () => {
  it('runs a complete class with main and println', () => {
    expect(executeJavaSubset('public class Main { public static void main(String[] args) { System.out.println("Hello, Java!"); } }')).toBe('Hello, Java!');
  });

  it('preserves Java left-to-right addition and print behavior', () => {
    expect(executeJavaSubset('int price = 40; int fee = 3; System.out.print(price + fee); System.out.println(" total");')).toBe('43 total');
    expect(executeJavaSubset('System.out.println("Total: " + 40 + 3);')).toBe('Total: 403');
  });

  it('executes a bounded ascending for loop', () => {
    expect(executeJavaSubset('for (int i = 1; i <= 3; i++) { System.out.println("Item " + i); }')).toBe('Item 1\nItem 2\nItem 3');
  });
});
