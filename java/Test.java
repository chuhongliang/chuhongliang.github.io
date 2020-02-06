import java.util.*;

public class Test {
	public static void main(String args[]) {
		Set<String> set = new HashSet<String>();
		set.add("Hello");
		set.add("world");
		set.add("Hello");
		System.out.println("集合的尺寸为:" + set.size());
		System.out.println("集合中的元素为:" + set.toString());

	}
}