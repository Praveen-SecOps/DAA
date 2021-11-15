import java.util.*;
class binary {
	int search(int arr[], int x)
	{
		int l = 0, r = arr.length - 1;
		while (l <= r) {
			int m = l + (r - l) / 2;
			if (arr[m] == x)
				return m;
			if (arr[m] < x)
				l = m + 1;
			else
				r = m - 1;
		}
		return -1;
	}

	public static void main(String args[])
	{
        Scanner sc=new Scanner(System.in);
        System.out.println("Enter the array size: ");
        int n=sc.nextInt();
		binary ob = new binary();
        System.out.println("Enter the array elements: ");
		int arr[] = new int[n];
        for(int i=0;i<n;i++){
            arr[i]=sc.nextInt();
        }
        System.out.println("Enter the key: ");
		int x = sc.nextInt();;
		int result = ob.search(arr, x);
		if (result == -1)
			System.out.println("Element not present");
		else
			System.out.println("Element found at index " + result);
	}
}

